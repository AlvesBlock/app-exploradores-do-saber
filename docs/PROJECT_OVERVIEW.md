# Visao Geral do Projeto

## Objetivo do app

Exploradores do Saber e um app infantil e educativo que combina:

- trilhas curtas de aprendizagem
- quizzes com feedback imediato
- recompensas claras e celebracoes
- experiencia mobile-first
- progressao persistente entre sessoes

O produto foi reorganizado para parecer e funcionar como um app real de aprendizagem gamificada, e nao como um prototipo de telas isoladas.

## Experiencias principais

- `Home / Landing`
  - apresenta o produto, os mundos de aprendizagem e o loop educativo do app
- `Onboarding`
  - cria o perfil infantil com nome e avatar inclusivo
- `Hub`
  - centraliza progresso, modulos, extras e proximos passos
- `Modulos`
  - cada modulo usa um plano de 5 dias com sessao curta de 4 perguntas
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
  - componentes compartilhados de onboarding e quiz
- `src/data/avatars/`
  - opcoes de avatar e normalizacao de legado
- `src/data/modules/`
  - catalogo dos modulos e banco de perguntas
- `src/services/`
  - perfil, progresso de modulo, geracao de quiz, audio, celebracao e pet
- `src/types/`
  - contratos do dominio do app principal

## Modelo atual dos modulos

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
4. No hub, escolhe um modulo, continua o pet ou entra no runner.
5. Ao concluir uma sessao de modulo:
   - recebe audio de acerto/erro ao longo da jornada
   - recebe estrelas persistidas
   - sobe de dia quando atinge pelo menos 75 por cento de acerto
   - dispara confete na primeira conclusao completa do modulo

## Hotspots atuais

- o app principal agora esta muito mais estruturado que antes, mas ainda depende de `localStorage`
  - nao existe backend ou sincronizacao em nuvem
- o Runner permanece com documentacao e runtime proprios
  - fora do escopo desta refatoracao do app principal
- os assets de audio e imagens do projeto ainda sao relativamente pesados
  - build estavel, mas otimizar assets continua sendo oportunidade futura

