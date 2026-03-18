import type { EcoNaveShipConfig, EcoNaveShipId } from '@/types/econave'

export const ECONAVE_SHIPS: EcoNaveShipConfig[] = [
  {
    id: 'aurora_seed',
    name: 'Aurora Seed',
    emoji: '🚀',
    unlockCredits: 0,
    description: 'Nave inicial equilibrada para explorar a orbita com seguranca.',
    accentColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #ecfeff 100%)',
    educationalBenefit: 'Ideal para aprender quando coletar, neutralizar e proteger.',
    stats: {
      moveSpeed: 0.44,
      fireCooldownMs: 230,
      maxEnergy: 100,
      magnetRadius: 0.16,
      pulseRadius: 0.24,
      startingPulseCharges: 1
    }
  },
  {
    id: 'solar_wing',
    name: 'Solar Wing',
    emoji: '🛸',
    unlockCredits: 120,
    description: 'Casco leve com paineis solares que aceleram disparo e mobilidade.',
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
    educationalBenefit: 'Reforca a ideia de energia limpa para ganhar eficiencia.',
    stats: {
      moveSpeed: 0.5,
      fireCooldownMs: 195,
      maxEnergy: 92,
      magnetRadius: 0.18,
      pulseRadius: 0.26,
      startingPulseCharges: 1
    }
  },
  {
    id: 'gaia_guard',
    name: 'Gaia Guard',
    emoji: '🛰️',
    unlockCredits: 260,
    description: 'Modelo reforcado para proteger satelites e segurar danos maiores.',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
    educationalBenefit: 'Premia escolhas cuidadosas e defesa de estruturas uteis.',
    stats: {
      moveSpeed: 0.41,
      fireCooldownMs: 215,
      maxEnergy: 118,
      magnetRadius: 0.2,
      pulseRadius: 0.28,
      startingPulseCharges: 2
    }
  }
]

export function getEcoNaveShip(shipId: EcoNaveShipId) {
  return ECONAVE_SHIPS.find((ship) => ship.id === shipId) ?? null
}
