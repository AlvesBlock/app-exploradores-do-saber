import { RUNNER_VEHICLES } from '@/engine/runner/data/vehicles'
import type {
  EmergencyHealCheckInput,
  EmergencyHealCheckResult,
  RunnerVehicle
} from '@/types/runner-game'

export function getRemainingTimePercent(
  timeRemainingSeconds: number,
  roundDurationSeconds: number
): number {
  if (roundDurationSeconds <= 0) return 0
  return Math.max(0, timeRemainingSeconds / roundDurationSeconds)
}

export function isEmergencyHealWindow(
  timeRemainingSeconds: number,
  roundDurationSeconds: number
): boolean {
  return getRemainingTimePercent(timeRemainingSeconds, roundDurationSeconds) <= 0.1
}

export function canUseEmergencyHeal(
  input: EmergencyHealCheckInput
): EmergencyHealCheckResult {
  if (input.currentLives !== 1) {
    return { allowed: false, reason: 'not_last_life' }
  }

  if (input.alreadyUsedEmergencyHeal) {
    return { allowed: false, reason: 'already_used' }
  }

  if (!isEmergencyHealWindow(input.timeRemainingSeconds, input.roundDurationSeconds)) {
    return { allowed: false, reason: 'not_in_final_window' }
  }

  if (input.currentCoins < input.healCost) {
    return { allowed: false, reason: 'insufficient_coins' }
  }

  return { allowed: true, reason: 'ok' }
}

export function getVehicleById(vehicleId: string): RunnerVehicle | undefined {
  return RUNNER_VEHICLES.find(vehicle => vehicle.id === vehicleId)
}

export function canUnlockVehicle(
  vehicle: RunnerVehicle,
  currentCoins: number,
  currentCarbonCredits: number
): boolean {
  return (
    currentCoins >= vehicle.unlockCoins &&
    currentCarbonCredits >= vehicle.unlockCarbonCredits
  )
}

export function getVehicleCollisionProtectionPercent(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId)
  return vehicle?.benefits.collisionProtection ?? 0
}

export function getVehicleCoinBonusMultiplier(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId)
  const bonusPercent = vehicle?.benefits.coinBonusPercent ?? 0

  return 1 + bonusPercent / 100
}

export function getVehicleEcoBonusMultiplier(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId)
  const bonusPercent = vehicle?.benefits.ecoScoreBonusPercent ?? 0

  return 1 + bonusPercent / 100
}

export function getVehicleShieldChargeMultiplier(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId)
  const bonus = vehicle?.benefits.shieldChargeBonus ?? 0

  return 1 + bonus
}

export function getVehicleLaneSwitchMultiplier(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId)
  return vehicle?.benefits.laneSwitchSpeed ?? 1
}