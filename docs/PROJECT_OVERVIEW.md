# Visao Geral do Projeto

## Objetivo do app

`Exploradores do Saber` e um app infantil e educativo que combina:

- trilhas curtas de aprendizagem
- quizzes com feedback imediato
- recompensas claras e celebracoes
- experiencias extras para ampliar o loop de retorno
- progressao persistente entre sessoes

O produto esta organizado para se comportar como um app real de aprendizagem gamificada, e nao como um conjunto de telas isoladas.

## Experiencias principais

- `Home / Landing`
  - apresenta o produto, os mundos e o loop do app
- `Onboarding`
  - cria o perfil infantil com nome e avatar
- `Hub`
  - centraliza progresso, modulos, extras e o card premium `Plus`
- `Modulos`
  - cada modulo usa um plano de 5 dias com sessao curta de 4 perguntas
- `Galeria Encantada`
  - modulo premium com album, missoes, quiz, memoria e destaque diario
  - usa a Disney API como fonte de personagens e imagens, com cache e fallback local
- `Pet`
  - usa estrelas conquistadas para reforcar o loop de cuidado e recompensa
- `Runner`
  - minijogo arcade separado da experiencia principal de estudo

## Stack

- Vue 3 com Composition API
- TypeScript strict
- Vite
- Vue Router
- Pinia
- PrimeVue + PrimeFlex
- Vitest
- ESLint + OXLint + Prettier

## Estrutura principal

- `src/views/`
  - telas do app
- `src/components/`
  - componentes compartilhados e componentes da `Galeria Encantada`
- `src/data/modules/`
  - catalogo dos modulos e banco de perguntas
- `src/data/magic-gallery/`
  - seeds curadas e colecoes do premium
- `src/engine/`
  - regras puras dos modulos especiais
- `src/composables/`
  - orquestracao de fluxo de tela, incluindo `useMagicGallery.ts`
- `src/services/`
  - perfil, progresso, audio, celebracao, premium unlock e integracao externa
- `src/types/`
  - contratos do dominio principal e do premium

## Modelo atual dos modulos principais

- cada modulo possui:
  - metadata visual e pedagogica
  - plano de 5 dias
  - pool maior de perguntas
  - sessao curta com 4 perguntas
- a selecao da sessao usa um modelo hibrido:
  - perguntas novas do dia atual
  - revisao de erros anteriores
  - aleatorizacao controlada para evitar repeticao cansativa
- o usuario nao fica travado por calendario real
  - a ideia de "5 dias" funciona como trilha de progressao, nao como bloqueio diario

## Fluxo do app

1. O usuario entra na landing.
2. Se nao existir perfil, vai para o onboarding.
3. Com perfil criado, acessa o hub.
4. No hub, escolhe um modulo, continua o pet, entra no runner ou acompanha o card premium `Plus`.
5. Ao concluir uma sessao de modulo:
   - recebe audio de acerto ou erro
   - recebe estrelas persistidas
   - sobe de dia quando atinge pelo menos 75 por cento de acerto
   - dispara confete na primeira conclusao completa do modulo
6. Ao concluir todos os modulos principais:
   - o `Hub` libera a `Galeria Encantada`
   - um overlay especial de conquista apresenta o novo portal
   - o premium entrega starter pack, poeira magica, destaque diario e minigames proprios

## Hotspots atuais

- o app principal ainda depende de `localStorage`
  - nao existe backend ou sincronizacao em nuvem
- o modulo premium depende de dados remotos da Disney API
  - a app usa cache local, adapter tipado e fallback curado para nao depender 100 por cento da rede
- o Runner permanece com documentacao e runtime proprios
  - fora do escopo do app principal
- os assets de audio e imagens do projeto ainda sao relativamente pesados
  - build estavel, mas otimizar payload continua sendo oportunidade futura
