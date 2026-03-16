# Modelo de Dados do Runner

## Rounds

- Definidos em `src/engine/runner/data/rounds.ts`
- Cada round agora inclui:
  - `round`, `title`, `background`
  - `durationSeconds`
  - `targetQualifiedCollects`
  - `baseSpeed`, `maxSpeed`
  - `tutorialWindowSeconds`
  - `collectibleIntervalMs`, `obstacleIntervalMs`
  - `laneCooldownMs`, `safeLaneWindowMs`
  - `maxVisibleEntities`
  - `obstacleRate`, `rareWasteChance`
  - `pollutionPenaltyMultiplier`
  - `victoryCoins`, `victoryCarbonCredits`
  - `emergencyHealCost`
  - `shieldChargeNeeded`

## Coletaveis

- Definidos em `src/engine/runner/data/wasteTypes.ts`
- Cada item contem:
  - `id`, `name`, `category`, `emoji`, `rarity`
  - `collectibleClass`
    - `good`
    - `bad`
    - `risky`
    - `special`
  - `coinValue`, `ecoScoreValue`, `carbonCreditValue`
  - `shieldChargeGain`
  - `wrongHandlingPenalty`
  - `spawnWeight`
  - `requiresShieldForQualified`
  - `feedbackText`

## Obstaculos

- Definidos em `src/engine/runner/data/obstacles.ts`
- Cada obstaculo contem:
  - `id`, `name`, `emoji`
  - `severity` (`minor` ou `major`)
  - `spawnWeight`
  - `scorePenalty`
  - `feedbackText`

## Veiculos

- Definidos em `src/engine/runner/data/vehicles.ts`
- Beneficios usados no runtime:
  - `laneSwitchSpeed`
  - `shieldChargeBonus`
  - `coinBonusPercent`
  - `ecoScoreBonusPercent`
  - `collisionProtection`

## Estado canonico (`RunnerGameState`)

- Definido em `src/types/runner-state.ts`
- O runtime importa esse contrato diretamente
- `src/types/runner.ts` continua apenas como alias de compatibilidade

### `player`
- `lane`
- `vehicleLevel`
- `vehicleId`
- `shieldCharge`
- `shieldChargeNeeded`
- `shieldActive`
- `shieldTimeLeft`
- `emergencyHealUsed`

### `stats`
- `score`, `coins`, `lives`
- `distance`, `speed`, `timeLeft`, `elapsedSeconds`
- `targetDistance`, `minCollectibles`
- `collectedCount`, `qualifiedCollects`
- `invalidCollects`, `riskyCollects`, `specialCollects`
- `ecoScore`, `carbonCredits`
- `collisionsTaken`, `shieldUses`, `shieldBlocks`
- `phaseLevel`

### `entities`
- Obstaculos e coletaveis resolvidos no spawn
- Payload de runtime por entidade:
  - `coinValue`, `ecoScoreValue`, `carbonCreditValue`
  - `shieldChargeGain`, `wrongHandlingPenalty`
  - `collectibleClass`, `requiresShieldForQualified`
  - `obstacleSeverity`, `scorePenalty`

### `roundProgress`
- `currentRound`
- `currentRoundConfig`
- `roundCompleted`
- `completionStatus`
- `endReason`
- `finalCard`
- `finalRankingEntry`
- `finalSummaryText`
- `finalResult`

### `meta`
- `selectedVehicleId`
- `unlockedVehicleIds`
- `walletCoins`
- `walletCarbonCredits`
- `highestUnlockedRound`

### `telemetry`
- `elapsedMs`
- `firstCollectAtMs`
- `firstCollisionAtMs`
- `collisionsByLane`

### `ui`
- `lastFeedback`

## Persistencia local

- Definida em `RunnerPersistentProgress`
- Armazenada por `runnerProgress.service.ts`
- Campos persistidos:
  - `totalCoins`
  - `totalCarbonCredits`
  - `selectedVehicleId`
  - `unlockedVehicleIds`
  - `highestUnlockedRound`
  - `rankings`
