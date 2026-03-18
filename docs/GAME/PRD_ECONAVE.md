# PRD: EcoNave - Guardioes da Orbita

## Objetivo

Adicionar ao Hub do app `Exploradores do Saber` um novo minigame arcade educativo mobile-first que ensina:

- separacao correta de residuos
- diferenca entre coletar, neutralizar, evitar e proteger
- impacto do lixo espacial
- responsabilidade ambiental aplicada a tecnologia e infraestrutura util

## Publico

- criancas em idade escolar
- uso prioritario em portrait mobile
- interacao rapida, clara e com boa resposta ao toque

## Escopo V1 entregue

- rota dedicada `/econave`
- card de entrada no Hub
- tela inicial do modo com introducao curta
- seletor de 5 fases
- seletor de naves com progressao local
- gameplay 2D com PixiJS
- feedback visual/sonoro e HUD
- power-ups: escudo, ima, pulso, camera de classificacao, turbo solar e desaceleracao temporal
- overlays de pausa, vitoria e derrota
- persistencia local versionada
- resumo educativo por fase
- boss final funcional

## Loop principal

1. Selecionar fase e nave.
2. Entrar em uma rodada curta com scroll orbital continuo.
3. Coletar reciclaveis por contato.
4. Neutralizar ameacas perigosas com pulso eco.
5. Evitar obstaculos naturais.
6. Proteger satelites e estruturas uteis.
7. Encerrar a rodada com score, estrelas, eco-creditos e card educativo.

## Criterios de sucesso do modulo

- abrir pelo Hub sem quebrar as outras jornadas
- rodar em mobile web com UI clara e controles acessiveis
- ensinar pela mecanica, nao por texto expositivo durante a acao
- manter progressao local isolada do restante do app
- passar por type-check, testes, lint e build

## Integracao com o Hub

- o Hub ganhou um card dedicado `EcoNave`
- o card mostra fase mais alta liberada e saldo de eco-creditos
- a integracao nao altera o fluxo dos modulos didaticos nem o premium existente

