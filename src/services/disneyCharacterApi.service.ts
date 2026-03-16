import type { DisneyApiCharacterRecord, DisneyApiCharacterResponse } from '@/types/magic-gallery'

const DISNEY_API_BASE_URL = 'https://api.disneyapi.dev'

async function parseDisneyResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Disney API request failed with status ${response.status}`)
  }

  return (await response.json()) as DisneyApiCharacterResponse
}

export const disneyCharacterApiService = {
  async getCharacterById(characterId: number): Promise<DisneyApiCharacterRecord> {
    const response = await fetch(`${DISNEY_API_BASE_URL}/character/${characterId}`)
    const payload = await parseDisneyResponse(response)
    return payload.data
  },

  async getCharactersByIds(characterIds: number[]) {
    const entries = await Promise.allSettled(
      characterIds.map(async (characterId) => ({
        characterId,
        payload: await this.getCharacterById(characterId)
      })),
    )

    return entries.reduce<Record<number, DisneyApiCharacterRecord>>((collected, entry) => {
      if (entry.status !== 'fulfilled') return collected

      collected[entry.value.characterId] = entry.value.payload
      return collected
    }, {})
  }
}
