import { getVehicleCollisionProtectionPercent } from '@/engine/runner/utils/progression'
import {
  addRunnerCarbonCredits,
  addRunnerCoins,
  addRunnerEcoScore,
  addRunnerScore,
  addRunnerShieldCharge,
  consumeOneLife,
  deactivateShield,
  incrementCollectedCount,
  incrementCollisionCount,
  incrementInvalidCollect,
  incrementQualifiedCollect,
  incrementRiskyCollect,
  incrementShieldBlock,
  incrementSpecialCollect,
  subtractRunnerEcoScore,
  subtractRunnerScore
} from '@/engine/runner/utils/state-mutations'
import type { RunnerFeedbackEvent } from '@/types/runner-game'
import type { RunnerEntity, RunnerGameState } from '@/types/runner-state'

export interface RunnerCollisionResult {
  feedback: RunnerFeedbackEvent | null
  shieldBlocked: boolean
  lifeLost: boolean
}

function resolvePollutionPenalty(
  gameState: RunnerGameState,
  entity: RunnerEntity
): number {
  const basePenalty = entity.wrongHandlingPenalty ?? 0
  const pollutionMultiplier = gameState.roundProgress.currentRoundConfig.pollutionPenaltyMultiplier
  return Math.max(1, Math.round(basePenalty * 6 * pollutionMultiplier))
}

function buildCollectFeedback(
  text: string,
  tone: RunnerFeedbackEvent['tone'],
  icon = '♻️'
): RunnerFeedbackEvent {
  return {
    kind: tone === 'warning' ? 'warning' : 'collect',
    tone,
    text,
    icon
  }
}

function processCollectibleCollision(
  gameState: RunnerGameState,
  entity: RunnerEntity
): RunnerCollisionResult {
  incrementCollectedCount(gameState)

  const collectClass = entity.collectibleClass ?? 'good'
  const requiresShield = entity.requiresShieldForQualified ?? false
  const isProtectedCollect = !requiresShield || gameState.player.shieldActive
  const feedbackText = entity.feedbackText ?? 'Coleta realizada.'

  if (collectClass === 'bad') {
    incrementInvalidCollect(gameState)
    addRunnerCoins(gameState, Math.max(1, (entity.coinValue ?? 1) - 1))
    subtractRunnerEcoScore(gameState, entity.wrongHandlingPenalty ?? 1)
    subtractRunnerScore(gameState, resolvePollutionPenalty(gameState, entity))

    return {
      feedback: buildCollectFeedback(`Nao qualificado: ${feedbackText}`, 'warning', '⚠️'),
      shieldBlocked: false,
      lifeLost: false
    }
  }

  addRunnerCoins(gameState, entity.coinValue ?? 1)
  addRunnerShieldCharge(gameState, entity.shieldChargeGain ?? 0)

  if (collectClass === 'special') {
    incrementSpecialCollect(gameState)
  }

  if (collectClass === 'risky') {
    incrementRiskyCollect(gameState)
  }

  if (isProtectedCollect) {
    addRunnerEcoScore(gameState, entity.ecoScoreValue ?? 0)
    addRunnerCarbonCredits(gameState, entity.carbonCreditValue ?? 0)
    addRunnerScore(gameState, collectClass === 'special' ? 28 : collectClass === 'risky' ? 20 : 16)

    if (entity.isQualifiedCollect !== false) {
      incrementQualifiedCollect(gameState)
    }

    return {
      feedback: buildCollectFeedback(feedbackText, collectClass === 'special' ? 'positive' : 'neutral'),
      shieldBlocked: false,
      lifeLost: false
    }
  }

  incrementInvalidCollect(gameState)
  addRunnerEcoScore(gameState, Math.max(1, Math.floor((entity.ecoScoreValue ?? 1) / 2)))
  subtractRunnerScore(gameState, resolvePollutionPenalty(gameState, entity))
  subtractRunnerEcoScore(gameState, entity.wrongHandlingPenalty ?? 1)

  return {
    feedback: buildCollectFeedback(`Faltou protecao: ${feedbackText}`, 'warning', '🛡️'),
    shieldBlocked: false,
    lifeLost: false
  }
}

function processObstacleCollision(
  gameState: RunnerGameState,
  entity: RunnerEntity
): RunnerCollisionResult {
  if (gameState.player.shieldActive) {
    incrementShieldBlock(gameState)
    deactivateShield(gameState)
    addRunnerScore(gameState, 10)

    return {
      feedback: {
        kind: 'block',
        tone: 'neutral',
        text: `Escudo segurou o impacto: ${entity.feedbackText ?? 'desvio protegido.'}`,
        icon: '🛡️'
      },
      shieldBlocked: true,
      lifeLost: false
    }
  }

  const collisionProtection = getVehicleCollisionProtectionPercent(gameState.player.vehicleId)
  const rawPenalty = entity.scorePenalty ?? 20
  const scorePenalty = Math.round(rawPenalty * (1 - collisionProtection))
  incrementCollisionCount(gameState)
  gameState.telemetry.collisionsByLane[gameState.player.lane] += 1
  consumeOneLife(gameState)
  subtractRunnerScore(gameState, scorePenalty)

  return {
    feedback: {
      kind: 'hit',
      tone: 'negative',
      text: entity.feedbackText ?? 'Colisao com obstaculo.',
      icon: '💥'
    },
    shieldBlocked: false,
    lifeLost: true
  }
}

export function resolveRunnerCollision(
  gameState: RunnerGameState,
  entity: RunnerEntity
): RunnerCollisionResult {
  if (entity.type === 'collectible') {
    return processCollectibleCollision(gameState, entity)
  }

  return processObstacleCollision(gameState, entity)
}
