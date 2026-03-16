import { magicGalleryCharacterSeeds, magicGalleryCollections } from '@/data/magic-gallery/magicGalleryCatalog.data'
import { uniqueStrings } from '@/engine/magic-gallery/random'
import { disneyCharacterApiService } from '@/services/disneyCharacterApi.service'
import type {
  DisneyApiCharacterRecord,
  MagicGalleryCharacter,
  MagicGalleryCharacterSeed,
  MagicGalleryCollection,
  MagicGalleryContentSnapshot
} from '@/types/magic-gallery'

const STORAGE_KEY = 'exploradores-magic-gallery-content-cache'
const CACHE_TTL_MS = 1000 * 60 * 60 * 12

interface PersistedContentCache {
  updatedAt: string
  characters: MagicGalleryCharacter[]
  collections: MagicGalleryCollection[]
}

function createFallbackCharacter(
  seed: MagicGalleryCharacterSeed,
  collection: MagicGalleryCollection,
): MagicGalleryCharacter {
  return {
    id: seed.id,
    externalId: seed.externalId,
    name: seed.fallbackName,
    imageUrl: seed.fallbackImageUrl,
    collectionId: collection.id,
    collectionTitle: collection.title,
    storyTitle: seed.storyTitle,
    tagline: seed.tagline,
    description: seed.description,
    emoji: seed.emoji,
    rarity: seed.rarity,
    themeTags: seed.themeTags,
    sourceTitles: [seed.storyTitle],
    allies: [],
    enemies: [],
    detailUrl: `https://api.disneyapi.dev/characters/${seed.externalId}`,
    source: 'fallback'
  }
}

function getCollectionMap() {
  return new Map(magicGalleryCollections.map((collection) => [collection.id, collection]))
}

function normalizeSourceTitles(record: DisneyApiCharacterRecord, seed: MagicGalleryCharacterSeed) {
  const titles = uniqueStrings([
    ...record.films,
    ...record.shortFilms,
    ...record.tvShows,
    ...record.videoGames,
    ...record.parkAttractions
  ]).filter((item) => item.trim().length > 0)

  return titles.length > 0 ? titles.slice(0, 5) : [seed.storyTitle]
}

function normalizeCharacterFromApi(
  seed: MagicGalleryCharacterSeed,
  collection: MagicGalleryCollection,
  record: DisneyApiCharacterRecord | null,
): MagicGalleryCharacter {
  if (!record) {
    return createFallbackCharacter(seed, collection)
  }

  return {
    id: seed.id,
    externalId: seed.externalId,
    name: record.name?.trim() || seed.fallbackName,
    imageUrl: record.imageUrl?.trim() || seed.fallbackImageUrl,
    collectionId: collection.id,
    collectionTitle: collection.title,
    storyTitle: seed.storyTitle,
    tagline: seed.tagline,
    description: seed.description,
    emoji: seed.emoji,
    rarity: seed.rarity,
    themeTags: seed.themeTags,
    sourceTitles: normalizeSourceTitles(record, seed),
    allies: uniqueStrings(record.allies).slice(0, 4),
    enemies: uniqueStrings(record.enemies).slice(0, 4),
    detailUrl: record.url || `https://api.disneyapi.dev/characters/${seed.externalId}`,
    source: 'api'
  }
}

function createFallbackSnapshot(): MagicGalleryContentSnapshot {
  const collectionMap = getCollectionMap()

  return {
    source: 'fallback',
    updatedAt: new Date(0).toISOString(),
    collections: magicGalleryCollections,
    characters: magicGalleryCharacterSeeds.map((seed) =>
      createFallbackCharacter(seed, collectionMap.get(seed.collectionId)!),
    )
  }
}

function readCache(): PersistedContentCache | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PersistedContentCache

    if (!Array.isArray(parsed.characters) || !Array.isArray(parsed.collections)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function saveCache(snapshot: MagicGalleryContentSnapshot) {
  const payload: PersistedContentCache = {
    updatedAt: snapshot.updatedAt,
    collections: snapshot.collections,
    characters: snapshot.characters
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function isCacheFresh(cache: PersistedContentCache) {
  const updatedAtMs = new Date(cache.updatedAt).getTime()
  return Number.isFinite(updatedAtMs) && Date.now() - updatedAtMs < CACHE_TTL_MS
}

export const magicGalleryContentService = {
  getFallbackSnapshot() {
    return createFallbackSnapshot()
  },

  getCachedSnapshot(): MagicGalleryContentSnapshot | null {
    const cache = readCache()
    if (!cache) return null

    return {
      source: 'cache',
      updatedAt: cache.updatedAt,
      collections: cache.collections,
      characters: cache.characters.map((character) => ({
        ...character,
        source: 'cache'
      }))
    }
  },

  async fetchLiveSnapshot(): Promise<MagicGalleryContentSnapshot> {
    const collectionMap = getCollectionMap()
    const apiRecords = await disneyCharacterApiService.getCharactersByIds(
      magicGalleryCharacterSeeds.map((seed) => seed.externalId),
    )

    const snapshot: MagicGalleryContentSnapshot = {
      source: Object.keys(apiRecords).length > 0 ? 'api' : 'fallback',
      updatedAt: new Date().toISOString(),
      collections: magicGalleryCollections,
      characters: magicGalleryCharacterSeeds.map((seed) =>
        normalizeCharacterFromApi(seed, collectionMap.get(seed.collectionId)!, apiRecords[seed.externalId] ?? null),
      )
    }

    saveCache(snapshot)
    return snapshot
  },

  async getSnapshot(forceRefresh = false): Promise<MagicGalleryContentSnapshot> {
    const cache = readCache()

    if (!forceRefresh && cache && isCacheFresh(cache)) {
      return {
        source: 'cache',
        updatedAt: cache.updatedAt,
        collections: cache.collections,
        characters: cache.characters.map((character) => ({
          ...character,
          source: 'cache'
        }))
      }
    }

    try {
      return await this.fetchLiveSnapshot()
    } catch {
      if (cache) {
        return {
          source: 'cache',
          updatedAt: cache.updatedAt,
          collections: cache.collections,
          characters: cache.characters.map((character) => ({
            ...character,
            source: 'cache'
          }))
        }
      }

      return createFallbackSnapshot()
    }
  }
}
