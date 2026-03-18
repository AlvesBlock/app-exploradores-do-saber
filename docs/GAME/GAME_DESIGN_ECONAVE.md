# Game Design: EcoNave

## Fantasia central

A crianca pilota uma nave ecológica que nao pode simplesmente destruir tudo. O aprendizado aparece na diferenca entre:

- coletar residuos reciclaveis
- neutralizar residuos perigosos
- evitar obstaculos naturais
- proteger satelites e paineis uteis

## Mecanicas-chave

### Movimento

- direcional por botoes grandes no rodape
- suporte a teclado com setas/WASD
- faixa de movimento limitada para manter legibilidade

### Disparo

- disparo sustentado por toque ou barra de espaco
- feedback curto de tiro e impacto
- o tiro e util para ameacas, mas gera penalidade ao atingir reciclaveis ou satelites

### Power-ups

- `shield`: absorve impactos
- `magnet`: atrai itens corretos
- `cleanup_pulse`: limpa ameacas e abre espaco
- `classifier`: permite classificar reciclaveis por tiro
- `turbo`: aumenta mobilidade e cadencia
- `time_slow`: reduz o ritmo da orbita por alguns segundos

### Boss

- `Monstro de Sucata Orbital`
- aparece na fase 5
- recebe dano por tiro e por pulso
- gera minions perigosos enquanto estiver ativo

## Estrutura das fases

1. `Orbita da Terra`: onboarding mecanico.
2. `Cinturao de Detritos`: mais residuos perigosos.
3. `Corredor dos Satelites`: reforco da protecao de infraestrutura.
4. `Tempestade de Microplasticos`: pressao e leitura visual.
5. `Monstro de Sucata Orbital`: prova final das regras.

## Recompensa

- score por boas decisoes
- eco-creditos por rodada
- ate 3 estrelas por fase
- desbloqueio gradual de naves

