# UI/UX Mobile do Runner

## Diretrizes principais

- Mobile-first: o runner deve priorizar portrait mobile antes de ajustar desktop e tablet.
- Alcance de polegar: CTAs e controles criticos devem ficar em zonas de facil alcance.
- Safe areas: toda HUD inferior e superior deve respeitar `env(safe-area-inset-*)`.
- Leitura da pista: a area jogavel nao pode competir visualmente com controles ou overlays.

## Overlay inicial

- O overlay inicial usa um card com `max-height` limitado a viewport util.
- O conteudo informativo rola internamente quando excede a altura disponivel.
- O CTA principal fica fixado na area de acao do card, separado do bloco rolavel.
- O usuario pode:
  - tocar em `Jogar agora` imediatamente
  - rolar o corpo do card para ver detalhes extras do round e do veiculo
- Em mobile pequeno, o card inicial ancora mais perto da base da tela para melhorar alcance.

## Hierarquia do card

- Cabecalho:
  - chip de contexto
  - titulo do modo
  - resumo curto da rodada
- Corpo rolavel:
  - seletor de round
  - stats da rodada
  - escolha de veiculo
  - blocos de objetivo
- Rodape de acao:
  - CTA primario em destaque
  - acoes secundarias abaixo, sem competir com o inicio rapido

## HUD e area jogavel

- A pista deve terminar acima da control safe area inferior.
- O veiculo do jogador deve permanecer visualmente livre, sem botoes por cima.
- Feedback textual temporario continua acima da pista e fora do dock de controle.

## Dock de controles

- O runner usa um dock inferior dedicado para toque.
- O dock e separado em dois grupos:
  - movimento: esquerda e direita
  - acoes: shield e heal
- Movimento fica em um cluster unico e alinhado, sem intercalar skills entre os botoes laterais.
- Acoes ficam em um cluster proprio, visualmente separado do movimento.
- O dock usa gradiente e `backdrop-filter` para separar HUD de jogo sem esconder a pista.

## Controles adicionais

- Motion control continua opcional e deve permanecer acao secundaria no overlay inicial.
- O uso do sensor nao pode substituir a descoberta imediata do CTA principal.

## Criterios de qualidade mobile

- Em viewport portrait proxima de `412 x 915`, o CTA inicial deve estar visivel sem exigir scroll.
- O conteudo do card inicial nao pode truncar sem alternativa de leitura.
- Esquerda e direita precisam ficar no mesmo contexto visual.
- Shield e heal nao podem cobrir o avatar nem disputar a mesma faixa visual da pista.
- O layout final deve continuar funcional em desktop e tablet sem duplicar estruturas.
