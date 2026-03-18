# Data Model: EcoNave

## Persistencia

`EcoNavePersistentProgress`

- `version`
- `ecoCredits`
- `totalStars`
- `highestUnlockedStage`
- `selectedShipId`
- `unlockedShipIds`
- `achievements`
- `settings`
- `stages`

## Registro por fase

`EcoNaveStageProgress`

- `unlocked`
- `attempts`
- `completions`
- `bestScore`
- `bestStars`
- `bestEcoScore`
- `highCombo`
- `lastPlayedAt`
- `completedAt`

## Estado de runtime

`EcoNaveRuntimeState`

- status da rodada
- configuracao da fase e da nave
- cronometro, combo, score e eco-creditos
- estado do jogador e efeitos ativos
- contadores da missao
- entidades, projeteis e particulas
- estado do boss
- feedback recente e camera shake

## Tipos centrais de entidade

- `recyclable`
- `hazard`
- `satellite`
- `obstacle`
- `powerup`
- `bonus`
- `boss`

