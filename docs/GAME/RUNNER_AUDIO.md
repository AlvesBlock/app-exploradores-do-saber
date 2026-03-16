# Audio do Runner

## Estado atual

O runner usa `src/services/runnerAudio.service.ts` como camada unica de audio.

## O que o servico faz

- efeitos sonoros por evento:
  - coleta
  - warning
  - hit
  - block
  - shield
  - heal
  - fim de round
- musica de fundo:
  - `tema1.mp3` nos rounds iniciais
  - `tema2.mp3` nos rounds mais intensos
  - `play`, `pause` e `stop`

## Integracao com o runtime

- o feedback do loop envia `RunnerFeedbackEvent`
- a view toca o audio correspondente via `runnerAudioService.playEvent()`
- a musica:
  - inicia ao entrar em `running`
  - pausa em `paused`
  - para ao sair do runner ou voltar a `idle`

## Observacoes

- o servico continua tolerante a bloqueios de autoplay do browser
- os efeitos curtos usam instancias novas de `Audio`
- a musica usa uma instancia persistente para evitar sobreposicao
