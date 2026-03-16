import { normalizeAvatarOption } from '@/data/avatars/avatarOptions.data'
import type { PlayerProfile } from '@/types/player'

const STORAGE_KEY = 'exploradores-player-profile'

function normalizeProfile(profile: Partial<PlayerProfile> | null): PlayerProfile | null {
  if (!profile || typeof profile.name !== 'string' || profile.name.trim().length < 2) {
    return null
  }

  const now = new Date().toISOString()

  return {
    name: profile.name.trim(),
    avatar: normalizeAvatarOption(profile.avatar),
    stars: Number.isFinite(profile.stars) ? Math.max(0, Number(profile.stars)) : 0,
    createdAt: profile.createdAt ?? now,
    lastActiveAt: profile.lastActiveAt ?? now
  }
}

export const playerProfileService = {
  save(profile: Omit<PlayerProfile, 'createdAt' | 'lastActiveAt'> & Partial<PlayerProfile>) {
    const existing = this.get()
    const nextProfile = normalizeProfile({
      ...existing,
      ...profile,
      createdAt: profile.createdAt ?? existing?.createdAt,
      lastActiveAt: new Date().toISOString()
    })

    if (!nextProfile) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile))
  },

  get(): PlayerProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
      const normalized = normalizeProfile(JSON.parse(raw) as Partial<PlayerProfile>)
      if (!normalized) return null

      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    } catch {
      return null
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },

  exists() {
    return !!this.get()
  },

  touchLastActive() {
    const profile = this.get()
    if (!profile) return

    this.save({
      ...profile,
      lastActiveAt: new Date().toISOString()
    })
  },

  addStars(amount: number) {
    const profile = this.get()
    if (!profile || !Number.isFinite(amount) || amount <= 0) return

    this.save({
      ...profile,
      stars: profile.stars + amount
    })
  },

  spendStars(amount: number) {
    const profile = this.get()
    if (!profile || !Number.isFinite(amount) || amount <= 0 || profile.stars < amount) {
      return false
    }

    this.save({
      ...profile,
      stars: profile.stars - amount
    })
    return true
  }
}

