# Test Plan: EcoNave

## Cobertura automatizada implementada

- regras pedagogicas:
  coleta correta, destruicao incorreta, protecao de satelites, pulso e power-ups
- persistencia:
  defaults, desbloqueio de fase, desbloqueio de nave, selecao de nave e settings
- runtime:
  score, pulso, vitoria, derrota e boss
- integracao:
  rota `/econave` e card no Hub

## Smoke/regressao executados

- type-check completo
- vitest completo
- lint do repositorio
- build Vite de producao

## Checklist manual recomendado

1. Abrir Hub com perfil existente e validar o card EcoNave.
2. Entrar na fase 1 e confirmar controles por toque.
3. Validar pausa, retomada e retorno ao briefing.
4. Finalizar uma fase com vitoria e checar desbloqueio da proxima.
5. Conferir persistencia de eco-creditos, nave selecionada e quality setting.
