import type { PlayerProfile } from '@/types/player'

const STORAGE_KEY = 'exploradores-player-profile'

export const playerProfileService = {
  save(profile: PlayerProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  },

  get(): PlayerProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as PlayerProfile
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

  addStars(amount: number) {
    const profile = this.get()
    if (!profile) return

    this.save({
      ...profile,
      stars: profile.stars + amount
    })
  }
}