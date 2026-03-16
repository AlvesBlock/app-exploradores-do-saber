# Fluxo de Trabalho para Desenvolvimento Assistido por IA

Esta documentação define o processo obrigatório que *qualquer IA/assistente* deve seguir ao trabalhar neste repositório.

⚠️ **Regra número 1**: NUNCA fazer alterações sem primeiro ler o código existente e a documentação relevante.

---

## 1) Ler a documentação base (ordem obrigatória)
1. `docs/README.md`
2. `docs/PROJECT_OVERVIEW.md`
3. `docs/ARCHITECTURE.md`
4. Documentos específicos da feature/área (ex: `docs/GAME/RUNNER_ARCHITECTURE.md`)

## 2) Entender o código real antes de qualquer mudança
- Abrir e ler os arquivos que serão impactados.
- Mapear os pontos de integração e dependências.
- Identificar where TODOs ou inconsistências.

## 3) Planejar a mudança (não codificar de imediato)
- Documentar o plano de implementação em `docs/FEATURES/` ou no changelog.
- Definir objetivos claros, arquivos a alterar, e critérios de sucesso.

## 4) Implementar incrementalmente
- Faça mudanças pequenas e testáveis.
- Commitar/registrar cada etapa no `docs` e no changelog.

## 5) Testar localmente
- Execute o conjunto de testes existentes (`npm run test:unit`).
- Execute build/typecheck/lint conforme relevante.
- Validar manualmente em browser se for UI.

## 6) Atualizar documentação
- Qualquer mudança funcional deve ser registrada nos docs apropriados.
- Atualize o changelog (`docs/GAME/CHANGELOG_RUNNER.md`) e o ADR se relevante.

## 7) Registrar pendências e decisões
- Ao encontrar incertezas ou problemas, registre em `docs/DECISIONS/` ou em `docs/GAME/RUNNER_ROADMAP.md`.
- Em caso de interrupção, documente o estado atual.

---

## O que a IA NUNCA deve fazer
- Não assumir estrutura de arquivos ou nomes sem verificar.
- Não remover ou substituir lógica existente sem plano de rollback.
- Não adicionar dependências externas sem aprovação explícita.
- Não ignorar erros de build/linte e prosseguir.

---

## Como lidar com incerteza
1. Identificar a fonte de dúvida (arquivo, fluxo, termo).
2. Buscar no código base (grep/search) por evidências.
3. Documentar o gap encontrado (em `docs/DECISIONS/` ou `docs/PROJECT_OVERVIEW.md`).
4. Propor opções e escolher a mais segura, preferindo manutenção de comportamento atual.

---

## Propor refatorações sem quebrar o fluxo
- Faça mudanças em camadas isoladas (e.g., mover funções para `utils/` sem alterar API pública).
- Crie testes guardrails antes de refatorar quando possível.
- Mantenha funções backward-compatíveis durante transição.
