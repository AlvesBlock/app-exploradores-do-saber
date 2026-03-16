# ADR-002 - Quiz principal com trilha de 5 dias e randomizacao controlada

## Status

Aceita.

## Contexto

O app principal tinha modulos com apenas 3 perguntas fixas e pouco senso de progressao. Isso fazia a experiencia parecer prototipo, com baixo valor de repeticao e pouca recompensa pedagogica.

## Decisao

Adotar um modelo hibrido para os modulos:

- trilha de 5 dias por modulo
- sessao curta de 4 perguntas
- geracao de sessao baseada em:
  - perguntas novas do dia atual
  - revisao de erros anteriores
  - aleatorizacao controlada para reduzir repeticao

## Consequencias

### Positivas

- progressao fica perceptivel
- quiz ganha variedade sem perder estrutura
- crianca pode repetir sessoes sem cansaco visual
- persistencia de sessao melhora retomada

### Negativas

- o contrato de progresso ficou mais rico e exige migracao de dados legados
- mais dados estaticos precisam ser mantidos no banco de perguntas

## Alternativas descartadas

- random puro
  - alta variacao, mas pouca sensacao de trilha
- calendario rigido de 5 dias reais
  - aumenta friccao e bloqueia uso livre do app

