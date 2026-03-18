import { ECONAVE_STAGE_ORDER, getEcoNaveStage } from '@/engine/econave/data/stages'
import { ECONAVE_SHIPS } from '@/engine/econave/data/ships'
import { getEcoNaveBlueprint } from '@/engine/econave/data/entities'
import {
  createEcoNaveParticleBurst,
  createEcoNaveRuntimeId,
  createEcoNaveRuntimeState,
  removeInactiveEcoNaveEntities
} from '@/engine/econave/runtime/state'
import {
  resolveEcoNavePlayerCollision,
  resolveEcoNaveProjectileHit,
  resolveEcoNavePulseHit
} from '@/engine/econave/runtime/rules'
import type {
  EcoNaveEntity,
  EcoNaveEntityBlueprint,
  EcoNaveInputState,
  EcoNaveProgressApplyResult,
  EcoNaveRenderQuality,
  EcoNaveRuntimeEvent,
  EcoNaveRuntimeFeedback,
  EcoNaveRuntimeState,
  EcoNaveShipId,
  EcoNaveStageId,
  EcoNaveStageResult
} from '@/types/econave'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pushFeedback(
  state: EcoNaveRuntimeState,
  eventList: EcoNaveRuntimeEvent[],
  feedback: Omit<EcoNaveRuntimeFeedback, 'id'>,
) {
  const payload = {
    id: createEcoNaveRuntimeId(state, 'feedback'),
    ...feedback
  }

  state.lastFeedback = payload
  eventList.push({
    kind: 'feedback',
    feedback: payload
  })
}

function pickWeightedBlueprint(
  stageId: EcoNaveStageId,
  category: EcoNaveEntity['kind'],
): EcoNaveEntityBlueprint | null {
  const stage = getEcoNaveStage(stageId)
  if (!stage) return null

  const pool = stage.spawn.blueprintIds
    .map((blueprintId) => getEcoNaveBlueprint(blueprintId))
    .filter((blueprint): blueprint is EcoNaveEntityBlueprint => !!blueprint && blueprint.kind === category)

  if (pool.length === 0) {
    return null
  }

  const totalWeight = pool.reduce((sum, blueprint) => sum + blueprint.spawnWeight, 0)
  let cursor = Math.random() * totalWeight

  for (const blueprint of pool) {
    cursor -= blueprint.spawnWeight
    if (cursor <= 0) {
      return blueprint
    }
  }

  return pool[pool.length - 1] ?? null
}

function pickSpawnCategory(state: EcoNaveRuntimeState) {
  const entries = Object.entries(state.stageConfig.spawn.categoryWeights) as Array<
    [EcoNaveEntity['kind'], number]
  >
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let cursor = Math.random() * totalWeight

  for (const [category, weight] of entries) {
    cursor -= weight
    if (cursor <= 0) {
      return category
    }
  }

  return 'recyclable' as const
}

function makeEntity(state: EcoNaveRuntimeState, blueprintId: string, input?: Partial<EcoNaveEntity>) {
  const blueprint = getEcoNaveBlueprint(blueprintId)
  if (!blueprint) return null

  return {
    id: createEcoNaveRuntimeId(state, 'entity'),
    blueprintId: blueprint.id,
    kind: blueprint.kind,
    handling: blueprint.handling,
    emoji: blueprint.emoji,
    color: blueprint.color,
    x: input?.x ?? randomBetween(0.14, 0.86),
    y: input?.y ?? -0.12,
    vx: input?.vx ?? randomBetween(-0.04, 0.04),
    vy: input?.vy ?? randomBetween(0.12, 0.24),
    radius: input?.radius ?? blueprint.radius,
    hp: input?.hp ?? blueprint.hitPoints ?? 1,
    maxHp: input?.maxHp ?? blueprint.hitPoints ?? 1,
    damage: input?.damage ?? blueprint.damage,
    scoreValue: input?.scoreValue ?? blueprint.scoreValue,
    ecoValue: input?.ecoValue ?? blueprint.ecoValue,
    creditValue: input?.creditValue ?? blueprint.creditValue,
    powerUpType: input?.powerUpType ?? blueprint.powerUpType ?? null,
    active: input?.active ?? true,
    angle: input?.angle ?? 0,
    angularVelocity: input?.angularVelocity ?? randomBetween(-2.6, 2.6)
  } satisfies EcoNaveEntity
}

function spawnEntity(state: EcoNaveRuntimeState) {
  const category = pickSpawnCategory(state)
  const blueprint = pickWeightedBlueprint(state.stageId, category)
  if (!blueprint) return

  const entity = makeEntity(state, blueprint.id, {
    x: category === 'satellite' ? randomBetween(0.18, 0.82) : randomBetween(0.12, 0.88),
    y: category === 'satellite' ? -0.16 : -0.12,
    vx: category === 'satellite' ? randomBetween(-0.02, 0.02) : randomBetween(-0.05, 0.05),
    vy:
      blueprint.kind === 'satellite'
        ? randomBetween(0.12, 0.16)
        : blueprint.kind === 'hazard'
          ? randomBetween(0.16, 0.28)
          : randomBetween(0.14, 0.23)
  })

  if (entity) {
    state.entities.push(entity)
  }
}

function spawnPowerUp(state: EcoNaveRuntimeState) {
  const powerUps = [
    'powerup_shield',
    'powerup_magnet',
    'powerup_pulse',
    'powerup_classifier',
    'powerup_turbo',
    'powerup_slow'
  ]
  const blueprintId = powerUps[Math.floor(Math.random() * powerUps.length)] ?? powerUps[0]!
  const entity = makeEntity(state, blueprintId, {
    x: randomBetween(0.16, 0.84),
    vy: randomBetween(0.12, 0.18)
  })

  if (entity) {
    state.entities.push(entity)
  }
}

function spawnBonus(state: EcoNaveRuntimeState) {
  const entity = makeEntity(state, 'eco_briefing', {
    x: randomBetween(0.18, 0.82),
    vy: randomBetween(0.1, 0.16)
  })

  if (entity) {
    state.entities.push(entity)
  }
}

function spawnBoss(state: EcoNaveRuntimeState, eventList: EcoNaveRuntimeEvent[]) {
  if (!state.stageConfig.boss || state.bossSpawned) return

  const boss = makeEntity(state, state.stageConfig.boss.blueprintId, {
    x: 0.5,
    y: 0.16,
    vx: 0.1,
    vy: 0,
    radius: 0.12,
    hp: state.stageConfig.boss.hitPoints,
    maxHp: state.stageConfig.boss.hitPoints,
    damage: 22
  })

  if (!boss) return

  state.entities.push(boss)
  state.bossSpawned = true
  state.bossHp = boss.hp
  state.bossMaxHp = boss.maxHp
  pushFeedback(state, eventList, {
    tone: 'mission',
    text: 'Monstro de sucata detectado. Proteja os satelites e ataque o nucleo.',
    icon: '👾',
    cue: 'boss'
  })
}

function spawnBossMinion(state: EcoNaveRuntimeState) {
  const bossConfig = state.stageConfig.boss
  if (!bossConfig || !state.bossSpawned || state.bossDefeated) return

  const blueprintId =
    bossConfig.minionBlueprintIds[Math.floor(Math.random() * bossConfig.minionBlueprintIds.length)] ??
    bossConfig.minionBlueprintIds[0]!
  const entity = makeEntity(state, blueprintId, {
    x: randomBetween(0.22, 0.78),
    y: 0.24,
    vy: randomBetween(0.18, 0.26)
  })

  if (entity) {
    state.entities.push(entity)
  }
}

function getSpeedMultiplier(state: EcoNaveRuntimeState) {
  const turboMultiplier = state.player.effects.turboMs > 0 ? 1.18 : 1
  const slowMultiplier = state.player.effects.slowMs > 0 ? 0.72 : 1

  return turboMultiplier * slowMultiplier
}

function applyResolution(
  state: EcoNaveRuntimeState,
  entity: EcoNaveEntity,
  resolution: ReturnType<typeof resolveEcoNavePlayerCollision>,
  eventList: EcoNaveRuntimeEvent[],
) {
  if (resolution.removeEntity) {
    entity.active = false
  }

  if (resolution.playerDamage > 0) {
    if (state.player.shieldHits > 0) {
      state.player.shieldHits = Math.max(0, state.player.shieldHits - 1)
      state.cameraShakeMs = Math.max(state.cameraShakeMs, 140)
      pushFeedback(state, eventList, {
        tone: 'mission',
        text: 'Escudo absorveu o impacto orbital.',
        icon: '🛡️',
        cue: 'powerup'
      })
    } else {
      state.player.energy = clamp(state.player.energy - resolution.playerDamage, 0, state.player.maxEnergy)
      state.cameraShakeMs = Math.max(state.cameraShakeMs, 220)
    }
  }

  state.score = Math.max(0, state.score + resolution.scoreDelta)
  state.creditsCollected = Math.max(0, state.creditsCollected + resolution.creditDelta)
  state.mission.ecoScore = Math.max(0, state.mission.ecoScore + resolution.ecoDelta)
  state.mission.collectedCorrect += resolution.collectDelta
  state.mission.neutralizedHazards += resolution.neutralizeDelta
  state.mission.protectedSatellites += resolution.protectedDelta
  state.mission.satellitesLost += resolution.lostSatelliteDelta

  if (resolution.bossDamage > 0) {
    state.bossHp = clamp(state.bossHp - resolution.bossDamage, 0, state.bossMaxHp)
    if (state.bossHp <= 0) {
      state.bossDefeated = true
      state.entities
        .filter((currentEntity) => currentEntity.kind === 'boss')
        .forEach((bossEntity) => {
          bossEntity.active = false
        })
    }
  }

  if (resolution.powerUpGranted) {
    if (resolution.powerUpGranted === 'shield') {
      state.player.shieldHits = Math.min(4, state.player.shieldHits + 2)
    }

    if (resolution.powerUpGranted === 'magnet') {
      state.player.effects.magnetMs = 6400
    }

    if (resolution.powerUpGranted === 'cleanup_pulse') {
      state.player.pulseCharges += 1
    }

    if (resolution.powerUpGranted === 'classifier') {
      state.player.effects.classifierMs = 6200
    }

    if (resolution.powerUpGranted === 'turbo') {
      state.player.effects.turboMs = 5200
    }

    if (resolution.powerUpGranted === 'time_slow') {
      state.player.effects.slowMs = 4600
    }
  }

  if (resolution.positive) {
    state.combo += 1
    state.comboBest = Math.max(state.comboBest, state.combo)
  } else if (resolution.playerDamage > 0 || resolution.lostSatelliteDelta > 0 || resolution.scoreDelta < 0) {
    state.combo = 0
  }

  createEcoNaveParticleBurst(state, {
    x: entity.x,
    y: entity.y,
    color: entity.color,
    size: entity.kind === 'boss' ? 8 : 4,
    amount: entity.kind === 'boss' ? 10 : 6
  })

  pushFeedback(state, eventList, resolution.feedback)
}

function updateEffects(state: EcoNaveRuntimeState, deltaMs: number) {
  state.player.effects.magnetMs = Math.max(0, state.player.effects.magnetMs - deltaMs)
  state.player.effects.classifierMs = Math.max(0, state.player.effects.classifierMs - deltaMs)
  state.player.effects.turboMs = Math.max(0, state.player.effects.turboMs - deltaMs)
  state.player.effects.slowMs = Math.max(0, state.player.effects.slowMs - deltaMs)
  state.player.fireCooldownMs = Math.max(0, state.player.fireCooldownMs - deltaMs)
  state.cameraShakeMs = Math.max(0, state.cameraShakeMs - deltaMs)
}

function updatePlayer(state: EcoNaveRuntimeState, input: EcoNaveInputState, deltaMs: number) {
  const speed = state.player.moveSpeed * getSpeedMultiplier(state)
  const deltaSeconds = deltaMs / 1000
  state.player.x = clamp(state.player.x + input.moveX * speed * deltaSeconds, 0.1, 0.9)
  state.player.y = clamp(state.player.y + input.moveY * speed * deltaSeconds, 0.16, 0.84)
}

function emitProjectile(state: EcoNaveRuntimeState, eventList: EcoNaveRuntimeEvent[]) {
  const cooldown =
    state.player.effects.turboMs > 0
      ? state.shipConfig.stats.fireCooldownMs * 0.82
      : state.shipConfig.stats.fireCooldownMs

  if (state.player.fireCooldownMs > 0) {
    return
  }

  state.player.fireCooldownMs = cooldown
  state.projectiles.push({
    id: createEcoNaveRuntimeId(state, 'shot'),
    x: state.player.x,
    y: state.player.y - state.player.radius * 0.8,
    vy: -0.92,
    radius: 0.016,
    ttlMs: 1400,
    active: true
  })

  eventList.push({
    kind: 'feedback',
    feedback: {
      id: createEcoNaveRuntimeId(state, 'feedback'),
      tone: 'mission',
      text: 'Pulso eco disparado.',
      icon: '🔵',
      cue: 'fire'
    }
  })
}

function updateProjectiles(state: EcoNaveRuntimeState, deltaMs: number) {
  const deltaSeconds = deltaMs / 1000

  state.projectiles.forEach((projectile) => {
    projectile.y += projectile.vy * deltaSeconds
    projectile.ttlMs -= deltaMs

    if (projectile.y < -0.18 || projectile.ttlMs <= 0) {
      projectile.active = false
    }
  })

  state.projectiles = removeInactiveEcoNaveEntities(state.projectiles)
}

function updateEntities(state: EcoNaveRuntimeState, deltaMs: number, eventList: EcoNaveRuntimeEvent[]) {
  const deltaSeconds = deltaMs / 1000
  const speedFactor = getSpeedMultiplier(state) * state.stageConfig.baseScrollSpeed
  const bossMoveScale = Math.sin(state.elapsedMs / 900) * 0.08

  state.entities.forEach((entity) => {
    if (entity.kind === 'boss') {
      entity.x = clamp(0.5 + bossMoveScale, 0.24, 0.76)
      entity.angle += deltaSeconds * 0.6
      return
    }

    if (
      state.player.effects.magnetMs > 0 &&
      (entity.kind === 'recyclable' || entity.kind === 'bonus' || entity.kind === 'powerup')
    ) {
      const dx = state.player.x - entity.x
      const dy = state.player.y - entity.y
      const distance = Math.hypot(dx, dy)

      if (distance < state.player.magnetRadius) {
        entity.vx += dx * deltaSeconds * 0.6
        entity.vy += dy * deltaSeconds * 0.6
      }
    }

    entity.x = clamp(entity.x + entity.vx * deltaSeconds, 0.08, 0.92)
    entity.y += entity.vy * deltaSeconds * (1 + speedFactor * 1.6)
    entity.angle += entity.angularVelocity * deltaSeconds

    if (entity.y > 1.14) {
      entity.active = false

      if (entity.kind === 'satellite') {
        state.mission.protectedSatellites += 1
        pushFeedback(state, eventList, {
          tone: 'mission',
          text: 'Satelite protegido ate sair do corredor orbital.',
          icon: '🛰️',
          cue: 'collect'
        })
      }
    }
  })

  state.entities = removeInactiveEcoNaveEntities(state.entities)
}

function updateParticles(state: EcoNaveRuntimeState, deltaMs: number) {
  const deltaSeconds = deltaMs / 1000

  state.particles.forEach((particle) => {
    particle.x += particle.vx * deltaSeconds
    particle.y += particle.vy * deltaSeconds
    particle.ttlMs -= deltaMs
    particle.alpha = clamp(particle.ttlMs / particle.maxTtlMs, 0, 1)

    if (particle.ttlMs <= 0) {
      particle.alpha = 0
    }
  })

  state.particles = state.particles.filter((particle) => particle.ttlMs > 0)
}

function distanceBetween(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y)
}

function handleProjectileHits(state: EcoNaveRuntimeState, eventList: EcoNaveRuntimeEvent[]) {
  state.projectiles.forEach((projectile) => {
    if (!projectile.active) return

    for (const entity of state.entities) {
      if (!entity.active) continue

      const hitDistance = distanceBetween(projectile, entity)
      if (hitDistance > projectile.radius + entity.radius) {
        continue
      }

      const resolution = resolveEcoNaveProjectileHit(entity, state.player.effects.classifierMs > 0)
      projectile.active = !resolution.projectileConsumed

      if (entity.kind !== 'boss') {
        entity.hp -= Math.max(1, resolution.bossDamage > 0 ? resolution.bossDamage : 1)
        if (entity.hp <= 0) {
          entity.active = false
        }
      }

      applyResolution(state, entity, resolution, eventList)
      break
    }
  })

  state.projectiles = removeInactiveEcoNaveEntities(state.projectiles)
}

function handlePlayerCollisions(state: EcoNaveRuntimeState, eventList: EcoNaveRuntimeEvent[]) {
  state.entities.forEach((entity) => {
    if (!entity.active) return

    const hitDistance = distanceBetween(state.player, entity)
    if (hitDistance > state.player.radius + entity.radius * 0.88) {
      return
    }

    const resolution = resolveEcoNavePlayerCollision(entity)
    applyResolution(state, entity, resolution, eventList)
  })

  state.entities = removeInactiveEcoNaveEntities(state.entities)
}

function maybeSpawnEntities(state: EcoNaveRuntimeState, deltaMs: number) {
  state.nextEntitySpawnMs -= deltaMs
  state.nextPowerUpSpawnMs -= deltaMs
  state.nextBonusSpawnMs -= deltaMs

  if (
    state.stageConfig.boss &&
    !state.bossSpawned &&
    state.elapsedMs >= state.stageConfig.boss.spawnAtSeconds * 1000
  ) {
    return
  }

  if (state.entities.length < state.stageConfig.spawn.maxEntities && state.nextEntitySpawnMs <= 0) {
    spawnEntity(state)
    state.nextEntitySpawnMs = randomBetween(
      state.stageConfig.spawn.entityIntervalMs[0],
      state.stageConfig.spawn.entityIntervalMs[1]
    )
  }

  if (state.nextPowerUpSpawnMs <= 0 && !state.entities.some((entity) => entity.kind === 'powerup')) {
    spawnPowerUp(state)
    state.nextPowerUpSpawnMs = randomBetween(
      state.stageConfig.spawn.powerUpIntervalMs[0],
      state.stageConfig.spawn.powerUpIntervalMs[1]
    )
  }

  if (state.nextBonusSpawnMs <= 0 && !state.entities.some((entity) => entity.kind === 'bonus')) {
    spawnBonus(state)
    state.nextBonusSpawnMs = randomBetween(
      state.stageConfig.spawn.bonusIntervalMs[0],
      state.stageConfig.spawn.bonusIntervalMs[1]
    )
  }
}

function maybeSpawnBossContent(state: EcoNaveRuntimeState, deltaMs: number, eventList: EcoNaveRuntimeEvent[]) {
  if (!state.stageConfig.boss) return

  if (!state.bossSpawned && state.elapsedMs >= state.stageConfig.boss.spawnAtSeconds * 1000) {
    spawnBoss(state, eventList)
  }

  if (state.bossSpawned && !state.bossDefeated) {
    state.nextBossMinionSpawnMs -= deltaMs

    if (state.nextBossMinionSpawnMs <= 0) {
      spawnBossMinion(state)
      state.nextBossMinionSpawnMs = state.stageConfig.boss.minionIntervalMs
    }
  }
}

function isMissionComplete(state: EcoNaveRuntimeState) {
  const goals = state.stageConfig.goals

  return (
    state.mission.collectedCorrect >= goals.collectTarget &&
    state.mission.neutralizedHazards >= goals.neutralizeTarget &&
    state.mission.protectedSatellites >= goals.protectTarget &&
    state.mission.ecoScore >= goals.ecoScoreTarget &&
    (!goals.bossDefeatRequired || state.bossDefeated)
  )
}

function calculateStars(state: EcoNaveRuntimeState, victory: boolean) {
  if (!victory) return 0

  let stars = 1

  if (state.player.energy >= state.player.maxEnergy * 0.55) {
    stars += 1
  }

  if (state.mission.satellitesLost === 0 && state.comboBest >= 8) {
    stars += 1
  }

  return clamp(stars, 1, 3)
}

function calculateEcoCredits(state: EcoNaveRuntimeState, victory: boolean) {
  const base = victory ? 22 + state.stageConfig.order * 9 : 8 + state.stageConfig.order * 3
  return base + Math.floor(state.creditsCollected * (victory ? 0.55 : 0.25))
}

export function finalizeEcoNaveStage(
  state: EcoNaveRuntimeState,
  applyProgress?: (result: EcoNaveStageResult) => EcoNaveProgressApplyResult,
): EcoNaveStageResult {
  const victory = isMissionComplete(state) && state.player.energy > 0
  const starsEarned = calculateStars(state, victory)
  const ecoCreditsEarned = calculateEcoCredits(state, victory)

  const summaryLines = victory
    ? [
        `Voce concluiu ${state.stageConfig.title} com ecoScore ${state.mission.ecoScore}.`,
        `Residuos corretos: ${state.mission.collectedCorrect}. Ameacas neutralizadas: ${state.mission.neutralizedHazards}.`,
        `Satelites protegidos: ${state.mission.protectedSatellites}. Combo maximo: ${state.comboBest}.`
      ]
    : [
        'A orbita ainda precisa de voce.',
        'Tente proteger mais estruturas uteis e diferenciar melhor o que deve ser coletado.',
        `Metas atuais: ${state.mission.collectedCorrect}/${state.mission.collectTarget} reciclaveis e ${state.mission.neutralizedHazards}/${state.mission.neutralizeTarget} ameacas neutralizadas.`
      ]

  const baseResult: EcoNaveStageResult = {
    stageId: state.stageId,
    victory,
    score: state.score,
    starsEarned,
    ecoCreditsEarned,
    ecoScore: state.mission.ecoScore,
    collectedCorrect: state.mission.collectedCorrect,
    neutralizedHazards: state.mission.neutralizedHazards,
    protectedSatellites: state.mission.protectedSatellites,
    satellitesLost: state.mission.satellitesLost,
    comboBest: state.comboBest,
    bossDefeated: state.bossDefeated,
    nextStageUnlocked: false,
    newlyUnlockedShipIds: [],
    educationalCard: state.stageConfig.educationalCard,
    summaryLines,
    completedAt: new Date().toISOString()
  }

  if (!applyProgress) {
    return baseResult
  }

  const progressResult = applyProgress(baseResult)

  return {
    ...baseResult,
    nextStageUnlocked: progressResult.nextStageUnlocked,
    newlyUnlockedShipIds: progressResult.newlyUnlockedShipIds
  }
}

function maybeCompleteStage(
  state: EcoNaveRuntimeState,
  eventList: EcoNaveRuntimeEvent[],
  applyProgress?: (result: EcoNaveStageResult) => EcoNaveProgressApplyResult,
) {
  const shouldFinishByEnergy = state.player.energy <= 0
  const shouldFinishByTimer = state.timeLeftMs <= 0
  const shouldFinishBoss =
    state.stageConfig.goals.bossDefeatRequired === true && state.bossDefeated && isMissionComplete(state)

  if (!shouldFinishByEnergy && !shouldFinishByTimer && !shouldFinishBoss) {
    return null
  }

  const result = finalizeEcoNaveStage(state, applyProgress)
  state.status = result.victory ? 'victory' : 'defeat'

  eventList.push({
    kind: 'result',
    result
  })

  pushFeedback(state, eventList, {
    tone: result.victory ? 'mission' : 'negative',
    text: result.victory
      ? 'Missao concluida. A orbita ficou mais segura.'
      : 'Missao interrompida. Reorganize a estrategia e tente outra vez.',
    icon: result.victory ? '🏆' : '🌍',
    cue: result.victory ? 'victory' : 'defeat'
  })

  return result
}

export function stepEcoNaveRuntime(
  state: EcoNaveRuntimeState,
  input: EcoNaveInputState,
  deltaMs: number,
  applyProgress?: (result: EcoNaveStageResult) => EcoNaveProgressApplyResult,
) {
  const eventList: EcoNaveRuntimeEvent[] = []

  if (state.status !== 'running') {
    return eventList
  }

  const boundedDelta = Math.min(deltaMs, 40)

  state.elapsedMs += boundedDelta
  state.timeLeftMs = Math.max(0, state.timeLeftMs - boundedDelta)
  state.backgroundOffset += (boundedDelta / 1000) * state.stageConfig.baseScrollSpeed

  updateEffects(state, boundedDelta)
  updatePlayer(state, input, boundedDelta)

  if (input.firePressed) {
    emitProjectile(state, eventList)
  }

  maybeSpawnBossContent(state, boundedDelta, eventList)
  maybeSpawnEntities(state, boundedDelta)
  updateProjectiles(state, boundedDelta)
  updateEntities(state, boundedDelta, eventList)
  handleProjectileHits(state, eventList)
  handlePlayerCollisions(state, eventList)
  updateParticles(state, boundedDelta)

  if (!state.stageWarningIssued && state.shipConfig.id === 'aurora_seed') {
    state.stageWarningIssued = true
    pushFeedback(state, eventList, {
      tone: 'mission',
      text: 'Dica rapida: coletar, neutralizar e proteger rendem mais do que atirar em tudo.',
      icon: '🧠',
      cue: 'alert'
    })
  }

  maybeCompleteStage(state, eventList, applyProgress)
  return eventList
}

export function activateEcoNavePulse(
  state: EcoNaveRuntimeState,
  applyProgress?: (result: EcoNaveStageResult) => EcoNaveProgressApplyResult,
) {
  const eventList: EcoNaveRuntimeEvent[] = []

  if (state.status !== 'running' || state.player.pulseCharges <= 0) {
    return eventList
  }

  state.player.pulseCharges -= 1
  state.cameraShakeMs = Math.max(state.cameraShakeMs, 180)

  state.entities.forEach((entity) => {
    if (!entity.active) return

    const distance = distanceBetween(state.player, entity)
    if (distance > state.player.pulseRadius + entity.radius + (entity.kind === 'boss' ? 0.18 : 0.06)) {
      return
    }

    const resolution = resolveEcoNavePulseHit(entity)
    applyResolution(state, entity, resolution, eventList)
  })

  maybeCompleteStage(state, eventList, applyProgress)
  return eventList
}

export function startEcoNaveStage(
  stageId: EcoNaveStageId,
  shipId: EcoNaveShipId,
  quality: EcoNaveRenderQuality,
) {
  const state = createEcoNaveRuntimeState(stageId, shipId, quality)
  state.status = 'running'
  return state
}

export function pauseEcoNaveRuntime(state: EcoNaveRuntimeState) {
  if (state.status === 'running') {
    state.status = 'paused'
  }
}

export function resumeEcoNaveRuntime(state: EcoNaveRuntimeState) {
  if (state.status === 'paused') {
    state.status = 'running'
  }
}

export function injectEcoNaveEntity(
  state: EcoNaveRuntimeState,
  blueprintId: string,
  input?: Partial<EcoNaveEntity>,
) {
  const entity = makeEntity(state, blueprintId, input)
  if (entity) {
    state.entities.push(entity)
  }
  return entity
}

export function getNextEcoNaveStageId(stageId: EcoNaveStageId) {
  const currentIndex = ECONAVE_STAGE_ORDER.indexOf(stageId)
  return ECONAVE_STAGE_ORDER[currentIndex + 1] ?? null
}

export function getEcoNaveShipUnlockIds(credits: number) {
  return ECONAVE_SHIPS.filter((ship) => credits >= ship.unlockCredits).map((ship) => ship.id)
}
