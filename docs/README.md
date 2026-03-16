# Documentação do Projeto: Exploradores do Saber

Bem-vindo à documentação do *Exploradores do Saber* — um aplicativo educativo gamificado com foco em aprendizagem ambiental, jogos educativos e progresso estruturado.

> 🧠 **Propósito**: fornecer contexto técnico e operacional para desenvolvedores humanos e assistentes de IA para trabalhar de forma segura, consistente e produtiva neste projeto.

---

## Como navegar nesta documentação

1. **`PROJECT_OVERVIEW.md`** – visão geral do projeto, stack e estrutura.
2. **`ARCHITECTURE.md`** – layout arquitetural detalhado do código e das responsabilidades.
3. **`AI_DEV_WORKFLOW.md`** – fluxo obrigatório para qualquer trabalho orientado por IA.
4. **`GAME/`** – documentação de produto e técnica do jogo (principalmente Runner).
5. **`FEATURES/`** – templates para novas features, plano de implementação e logs.
6. **`DECISIONS/`** – registro de decisões arquiteturais (ADR).
7. **`TESTING/`** – plano de testes manual e de regressão.

---

## Regra básica de atualização

Sempre que uma alteração significativa for feita no código (novas features, refatoração, correção de bugs), **a documentação deve ser atualizada** para refletir o estado real do projeto e as decisões tomadas.

Para alterações pequenas, inclua pelo menos um parágrafo em:
- `docs/PROJECT_OVERVIEW.md` (modificações na estrutura ou stack)
- `docs/ARCHITECTURE.md` (mudanças na organização em camadas)
- `docs/GAME/...` (qualquer mudança no comportamento do jogo)

---

## Etiqueta para contribuições

- Mantenha a documentação sincronizada com o código.
- Use a linguagem do produto (português brasileiro).  
- Referencie arquivos e symbols usando `code formatting` (ex: `RunnerView.vue`, `runRunnerLoop`).
- Mantenha o foco em **contexto operacional**, não apenas especulação.
