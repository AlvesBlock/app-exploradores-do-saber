# Visão Geral do Projeto

## Objetivo do App

Exploradores do Saber é um aplicativo infantil/educativo que combina revisão de conteúdos (módulos de estudo) com micro-jogos e experiências gamificadas. O objetivo principal é tornar o aprendizado interativo, com foco em:

- Educação ambiental e sustentabilidade
- Gamificação e reconhecimento do progresso
- Experiências mobile-first e acessíveis

## Módulos Existentes

- **Home / Landing**: ponto de entrada com navegação para módulos e área dos pais.
- **Onboarding**: criação/seleção de perfil de usuário.
- **Hub**: painel com módulos de aprendizagem e acesso a jogos.
- **Módulos**: conjunto de fases temáticas de revisão (não parte do escopo do runner).
- **Pet**: sistema de pet virtual (estado de guarda e progressão).
- **Runner**: minijogo educativo de reciclagem e economia verde.

## Stack Tecnológica

- **Frontend**: Vue 3 (Composition API)
- **Bundler**: Vite
- **Roteamento**: Vue Router (v5)
- **Estado global**: Pinia (apenas um store de exemplo no momento)
- **UI**: PrimeVue + PrimeFlex + PrimeUI Themes
- **Teste**: Vitest (configuração presente, poucos testes)
- **Lint/Format**: ESLint, OXLint, Prettier

## Estrutura de Diretórios Principal

- `src/` – código fonte
  - `assets/` – imagens, áudio, estilos
  - `components/` – componentes visuais reusáveis
  - `composables/` – hooks/Vue composables (ex: runner)
  - `engine/` – lógica de domínio do runner (dados, utils, entidades)
  - `router/` – rotas da aplicação
  - `services/` – serviços (persistência local, áudio, perfis)
  - `stores/` – Pinia stores
  - `types/` – definições TypeScript compartilhadas
  - `views/` – telas/rotas principais

## Fluxo de Execução do App

1. Usuário inicia na landing (`HomeView`).
2. Se já existe perfil, navega-se para o Hub (`HubView`).
3. No Hub, o usuário pode escolher módulos, abrir o Runner (`/runner`), ver pet, etc.
4. O Runner (`RunnerView`) usa um motor de jogo simples em `src/engine/runner`.

## Hotspots Técnicos Identificados

- O módulo **Runner** está parcialmente estruturado (dados avançados existem, mas a implementação do loop é simplificada).
- O runner agora unifica o estado (`RunnerGameState`) com o modelo de domínio (shield em vez de turbo) e usa o mesmo contrato em toda a arquitetura.
- Ausência de persistência de progresso do runner (não salva em localStorage).
- UI do Runner mistura lógica de jogo (loop, colisão) e apresentação; refatoração é necessária.
- Falta documentação interna sobre como o runner funciona e como estender com novos resíduos/veículos.
