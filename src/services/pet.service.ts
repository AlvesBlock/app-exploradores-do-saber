import type { PetState } from '@/types/pet'
import { playerProfileService } from '@/services/playerProfile.service'

const STORAGE_KEY = 'exploradores-pet-state'

function defaultPetState(): PetState {
  return {
    name: 'Felicio',
    emoji: '🐰',
    happiness: 70,
    energy: 70,
    snacks: 0
  }
}

export const petService = {
  get(): PetState {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      const defaults = defaultPetState()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }

    try {
      return JSON.parse(raw) as PetState
    } catch {
      const defaults = defaultPetState()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
  },

  save(pet: PetState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet))
  },

  feedWithStars() {
    const pet = this.get()

    if (!playerProfileService.spendStars(1)) {
      return { ok: false, message: 'Voce precisa de pelo menos 1 estrela para alimentar o pet.' }
    }

    const nextPet: PetState = {
      ...pet,
      snacks: pet.snacks + 1,
      happiness: Math.min(100, pet.happiness + 8),
      energy: Math.min(100, pet.energy + 5)
    }

    this.save(nextPet)

    return { ok: true, pet: nextPet }
  },

  play() {
    const pet = this.get()

    const nextPet: PetState = {
      ...pet,
      happiness: Math.min(100, pet.happiness + 10),
      energy: Math.max(0, pet.energy - 6)
    }

    this.save(nextPet)
    return nextPet
  },

  rest() {
    const pet = this.get()

    const nextPet: PetState = {
      ...pet,
      energy: Math.min(100, pet.energy + 12),
      happiness: Math.max(0, pet.happiness - 2)
    }

    this.save(nextPet)
    return nextPet
  },

  reset() {
    this.save(defaultPetState())
  }
}

