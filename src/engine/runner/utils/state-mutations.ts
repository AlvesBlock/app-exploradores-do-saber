import {
  getVehicleCoinBonusMultiplier,
  getVehicleEcoBonusMultiplier,
  getVehicleShieldChargeMultiplier
} from '@/engine/runner/utils/progression'
import type { RunnerGameState } from '@/types/runner-state'

export const DEFAULT_SHIELD_DURATION_SECONDS = 4

export function addRunnerCoins(gameState: RunnerGameState, amount: number): void {
  const multiplier = getVehicleCoinBonusMultiplier(gameState.player.vehicleId)
  const total = Math.floor(Math.max(0, amount) * multiplier)
  gameState.stats.coins += total
}

export function addRunnerEcoScore(gameState: RunnerGameState, amount: number): void {
  const multiplier = getVehicleEcoBonusMultiplier(gameState.player.vehicleId)
  const total = Math.floor(Math.max(0, amount) * multiplier)

  gameState.stats.ecoScore += total
}

export function addRunnerShieldCharge(gameState: RunnerGameState, amount: number): void {
  const multiplier = getVehicleShieldChargeMultiplier(gameState.player.vehicleId)
  const total = Math.floor(Math.max(0, amount) * multiplier)

  gameState.player.shieldCharge += total
}

export function addRunnerCarbonCredits(gameState: RunnerGameState, amount: number): void {
  gameState.stats.carbonCredits += Math.max(0, Math.floor(amount))
}

export function addRunnerScore(gameState: RunnerGameState, amount: number): void {
  gameState.stats.score = Math.max(0, gameState.stats.score + Math.floor(amount))
}

export function subtractRunnerScore(gameState: RunnerGameState, amount: number): void {
  gameState.stats.score = Math.max(0, gameState.stats.score - Math.max(0, Math.floor(amount)))
}

export function subtractRunnerEcoScore(gameState: RunnerGameState, amount: number): void {
  gameState.stats.ecoScore = Math.max(0, gameState.stats.ecoScore - Math.max(0, Math.floor(amount)))
}

export function incrementQualifiedCollect(gameState: RunnerGameState): void {
  gameState.stats.qualifiedCollects += 1
}

export function incrementCollectedCount(gameState: RunnerGameState): void {
  gameState.stats.collectedCount += 1
}

export function incrementInvalidCollect(gameState: RunnerGameState): void {
  gameState.stats.invalidCollects += 1
}

export function incrementRiskyCollect(gameState: RunnerGameState): void {
  gameState.stats.riskyCollects += 1
}

export function incrementSpecialCollect(gameState: RunnerGameState): void {
  gameState.stats.specialCollects += 1
}

export function incrementCollisionCount(gameState: RunnerGameState): void {
  gameState.stats.collisionsTaken += 1
}

export function incrementShieldUse(gameState: RunnerGameState): void {
  gameState.stats.shieldUses += 1
}

export function incrementShieldBlock(gameState: RunnerGameState): void {
  gameState.stats.shieldBlocks += 1
}

export function consumeOneLife(gameState: RunnerGameState): void {
  gameState.stats.lives = Math.max(0, gameState.stats.lives - 1)
}

export function restoreOneLife(gameState: RunnerGameState): void {
  gameState.stats.lives += 1
}

export function spendRunnerCoins(gameState: RunnerGameState, amount: number): void {
  gameState.stats.coins = Math.max(0, gameState.stats.coins - Math.max(0, Math.floor(amount)))
}

export function spendWalletCoins(gameState: RunnerGameState, amount: number): void {
  gameState.meta.walletCoins = Math.max(
    0,
    gameState.meta.walletCoins - Math.max(0, Math.floor(amount))
  )
}

export function addWalletRewards(
  gameState: RunnerGameState,
  coins: number,
  carbonCredits: number
): void {
  gameState.meta.walletCoins += Math.max(0, Math.floor(coins))
  gameState.meta.walletCarbonCredits += Math.max(0, Math.floor(carbonCredits))
}

export function canActivateShield(gameState: RunnerGameState): boolean {
  return (
    gameState.player.shieldCharge >= gameState.player.shieldChargeNeeded &&
    !gameState.player.shieldActive
  )
}

export function activateShield(
  gameState: RunnerGameState,
  durationSeconds = DEFAULT_SHIELD_DURATION_SECONDS
): boolean {
  if (!canActivateShield(gameState)) {
    return false
  }

  gameState.player.shieldActive = true
  gameState.player.shieldCharge = 0
  gameState.player.shieldTimeLeft = durationSeconds
  incrementShieldUse(gameState)

  return true
}

export function deactivateShield(gameState: RunnerGameState): void {
  gameState.player.shieldActive = false
  gameState.player.shieldTimeLeft = 0
}
