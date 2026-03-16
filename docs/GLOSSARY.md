# Glossario do Projeto

## Termos Gerais

- **Hub**: tela central do app com progresso, modulos, extras e acesso ao premium.
- **Plus**: linguagem visual usada no Hub para o modulo premium.
- **Galeria Encantada**: modulo premium acessado em `/galeria-encantada`.
- **magicDust**: moeda local da `Galeria Encantada`, usada para revelar personagens no album.
- **Destaque diario**: personagem misterioso do dia, com reward na primeira revelacao.
- **Starter pack**: recompensa entregue no primeiro unlock do premium.
- **HUD**: heads-up display, interface com informacoes de jogo.

## Conceitos do premium

- **Unlock status premium**: estado derivado do card `Plus` no Hub.
  - `locked`
  - `almost-unlocked`
  - `just-unlocked`
  - `available`
  - `visited`
- **Album**: grade de personagens bloqueados e desbloqueados da `Galeria Encantada`.
- **Colecao**: agrupamento tematico interno do premium, usado para progresso visual.

## Conceitos do Runner

- **Runner**: minijogo de corrida / coleta localizado em `/runner`.
- **Round**: uma fase do jogo Runner.
- **Card Educativo**: mensagem mostrada ao final do round, com aprendizado sobre sustentabilidade.
- **ecoScore**: pontuacao ambiental obtida ao coletar residuos corretamente.
- **carbonCredits**: creditos de carbono ganhos pela boa performance.
- **qualifiedCollects**: numero de itens coletados que contam como coleta qualificada.
- **shield**: recurso de protecao que evita perda de vida em uma colisao.
- **emergencyHeal**: cura emergencial que pode restaurar uma vida em situacao critica.
- **vehicle**: veiculo selecionavel com bonus e atributos.

## Estruturas de Dados

- **RunnerGameState**: estado atual do Runner.
- **RunnerRoundConfig**: configuracao de parametros por round.
- **RunnerWasteType**: definicao de cada tipo de residuo.
- **RunnerVehicle**: definicao de cada veiculo.
- **RunnerRankingEntry**: registro de desempenho ao final de um round.
- **MagicGalleryProgress**: progresso persistido do premium.
- **MagicGalleryUnlockStatus**: contrato do estado visual e funcional do card premium no Hub.
