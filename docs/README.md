# Documentacao do Projeto: Exploradores do Saber

Esta pasta concentra o contexto tecnico e operacional do app `Exploradores do Saber`.

O estado atual do produto inclui:

- trilhas principais com plano de 5 dias por modulo
- `Hub` com progresso, extras e um card premium `Plus`
- modulo premium `Galeria Encantada`, desbloqueado apos a conclusao dos 4 mundos principais
- `Pet` e `Runner` como experiencias paralelas ao estudo principal

## Ordem recomendada de leitura

1. `PROJECT_OVERVIEW.md`
2. `ARCHITECTURE.md`
3. `AI_DEV_WORKFLOW.md`
4. `CODING_RULES.md`
5. `GLOSSARY.md`
6. `FEATURES/MAGIC_GALLERY.md` e `FEATURES/QUIZ_SYSTEM.md`
7. `DECISIONS/`
8. `GAME/`
9. `TESTING/`

## Diretorios mais importantes

- `FEATURES/`
  - documentacao funcional das features do app principal
- `DECISIONS/`
  - ADRs com decisoes arquiteturais relevantes
- `GAME/`
  - documentacao dedicada ao Runner
- `TESTING/`
  - checklist manual e regressao

## Regra de manutencao

Qualquer mudanca funcional relevante deve atualizar pelo menos:

- `docs/PROJECT_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- o doc da feature impactada em `docs/FEATURES/`
- `docs/GLOSSARY.md` se novos termos virarem linguagem do produto

## Etiqueta para contribuicoes

- mantenha docs sincronizados com o estado real do codigo
- prefira portugues brasileiro em linguagem de produto
- documente regras, dependencias e riscos concretos
- registre decisoes arquiteturais em `docs/DECISIONS/` quando a mudanca alterar contratos ou fluxo central
