# Arquitetura do Projeto

## Visao geral por camadas

### 1) Apresentacao

- `src/views/`
  - `HomeView.vue`
  - `OnboardingView.vue`
  - `HubView.vue`
  - `ModuleView.vue`
  - `PetView.vue`
  - `RunnerView.vue`
- `src/components/`
  - componentes pequenos e reaproveitaveis de onboarding e quiz
- `src/assets/styles/main.css`
  - sistema visual global mobile-first

### 2) Dados estaticos

- `src/data/avatars/avatarOptions.data.ts`
  - catalogo de avatares inclusivos
  - normalizacao de avatares legados
- `src/data/modules/moduleCatalog.data.ts`
  - metadata visual e pedagogica dos mundos
- `src/data/modules/moduleQuestionBank.data.ts`
  - banco de perguntas por modulo e por dia
- `src/data/modules/modules.data.ts`
  - agregador e helpers de consulta

### 3) Dominio do app principal

- `src/types/player.ts`
  - contrato do perfil e metadados de avatar
- `src/types/module.ts`
  - contratos de modulo, pergunta, sessao, resumo e progresso
- `src/types/pet.ts`
  - contrato do pet

### 4) Servicos

- `src/services/playerProfile.service.ts`
  - persistencia e migracao do perfil infantil
- `src/services/moduleQuiz.service.ts`
  - selecao de perguntas, aleatorizacao controlada e avaliacao de resposta
- `src/services/moduleProgress.service.ts`
  - persistencia do progresso, sessao ativa, resumo da sessao e desbloqueio de modulos
- `src/services/audio.service.ts`
  - feedback sonoro curto com gate por interacao do usuario
- `src/services/celebration.service.ts`
  - confete para conclusao de modulo
- `src/services/pet.service.ts`
  - estado do pet e consumo de estrelas
- `src/services/runner*.ts`
  - runtime e persistencia do runner, mantidos fora do escopo desta refatoracao

### 5) Roteamento

- `src/router/index.ts`
  - rotas centrais do app
  - guard simples para exigir perfil antes de acessar hub, modulos, pet e runner

## Arquitetura do quiz

### Modelo escolhido

Foi adotado um modelo hibrido entre trilha guiada e randomizacao:

- cada modulo tem 5 dias
- cada sessao entrega 4 perguntas
- a sessao prioriza:
  - perguntas novas do dia atual
  - revisao de itens errados
  - perguntas frescas ainda pouco vistas
- a trilha nao bloqueia o usuario por data real
  - o "dia" representa etapa pedagogica

### Contrato de sessao

`ModuleQuizSession` guarda:

- `moduleId`
- `mode`
- `day`
- `questionIds`
- `currentQuestionIndex`
- `answers`
- `startedAt`
- `completedAt`

### Contrato de progresso

`ModuleProgress` guarda:

- desbloqueio do modulo
- dias concluidos
- estrelas ganhas no modulo
- total de respostas
- total de acertos
- melhor precisao
- streak atual
- ids dominados
- ids para revisao
- memoria curta de perguntas recentes
- sessao ativa persistida
- ultimo resumo da sessao
- data de conclusao completa

## Fluxo principal do modulo

1. `ModuleView.vue` carrega o modulo e o progresso.
2. `moduleProgressService.createOrResumeSession()` cria ou retoma a sessao.
3. `moduleQuizService` fornece pergunta atual e avaliacao da resposta.
4. `moduleProgressService.saveAnswer()` persiste cada resposta.
5. `moduleProgressService.completeSession()` fecha a sessao e decide:
   - se o dia avanca
   - se o modulo foi concluido
   - se o proximo modulo foi desbloqueado
6. `playerProfileService.addStars()` recebe as estrelas da sessao.
7. `audio.service.ts` dispara feedback curto.
8. `celebration.service.ts` dispara confete na primeira conclusao completa.

## Decisoes importantes

- progresso persistente de sessao evita perda ao recarregar a pagina
- feedback de quiz ficou desacoplado da UI
- views continuam responsaveis por UX e navegacao
- servicos concentram dominio, persistencia e regras de progressao
- Runner continua separado para evitar acoplamento indevido entre app principal e arcade

## Riscos conhecidos

- persistencia ainda e local
- sem backend, o app nao sincroniza progresso entre dispositivos
- imagens e audios do projeto ainda podem ser otimizados para reduzir payload

