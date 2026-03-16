# Glossário do Projeto

Este glossário define termos usados no código e no jogo, principalmente relacionados ao módulo Runner.

## Termos Gerais
- **Runner**: minijogo de corrida / coleta localizado em `/runner`.
- **Round**: uma fase do jogo Runner (são 10 rounds planejados).
- **HUD**: heads-up display, interface com informações de jogo (vidas, moedas, progresso).
- **Card Educativo**: mensagem mostrada ao final do round, com aprendizado sobre sustentabilidade.

## Conceitos do Runner
- **ecoScore**: pontuação ambiental obtida ao coletar resíduos corretamente.
- **carbonCredits**: créditos de carbono ganhos pela boa performance.
- **qualifiedCollects**: número de itens coletados que foram considerados "qualificados" (corretos ou valiosos).
- **shield**: recurso de proteção que evita perda de vida em uma colisão.
- **emergencyHeal**: cura emergencial que pode restaurar uma vida em uma situação crítica.
- **vehicle**: veículo selecionável com bônus e atributos (tier, custo, benefícios).

## Estruturas de Dados
- **RunnerGameState**: estado atual do jogo (status, player, stats, entidades etc.).
- **RunnerRoundConfig**: configuração de parâmetros por round (duração, meta, velocidade, custos, etc.).
- **RunnerWasteType**: definição de cada tipo de resíduo (valor, penalidades, tags).
- **RunnerVehicle**: definição do veículo (custo, bônus, tier).
- **RunnerRankingEntry**: registro de desempenho ao final de um round.

> Nota: Nem todos os termos acima estão totalmente implementados atualmente; alguns existem no modelo de dados mas ainda não são usados no loop do jogo.
