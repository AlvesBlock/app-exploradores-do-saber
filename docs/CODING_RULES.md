# Regras de Codificação do Projeto

Este documento descreve padrões e convenções observadas no código atual. Siga-o ao desenvolver novas funcionalidades.

## Convenções Gerais
- Código em **TypeScript** (strict mode via `vue-tsc`).
- Utilize **Composition API** para componentes Vue.
- Prefira **tipagem explícita** em props, retornos de funções e dados de estado.
- Favor **funções puras** (sem efeitos colaterais) para lógica de domínio.
- Separar **dados estáticos** (configs, JSON, constantes) da **lógica de execução**.

## Estrutura de Pastas
- `src/views/`: telas roteadas.
- `src/components/`: componentes genéricos (UI, layout).
- `src/composables/`: hooks / lógica reutilizável para Vue.
- `src/engine/`: lógica de domínio e regras do jogo (runner).
- `src/services/`: serviços (áudio, persistência).
- `src/types/`: interfaces e tipos.

## Composables
- Devem ser **isolados** e **testáveis**.
- Não devem depender de componentes específicos.
- Use `onMounted`, `onBeforeUnmount` para controlar efeitos colaterais.

## Tipos e Interfaces
- Colocar no diretório `src/types/`.
- Use `type`/`interface` para contratuais fortes entre módulos.
- Mantenha tipos consistentes com o estado inicial (`RUNNER_DEFAULT_STATE`).

## Dados e Assets
- Dados do jogo (rounds, resíduos, veículos, cards) ficam em `src/engine/runner/data/`.
- Áudio em `src/assets/audio/`.
- Imagens em `src/assets/images/`.

## Áudio e Efeitos Sonoros
- Use serviços em `src/services/` para encapsular reprodução.
- Evite múltiplas instâncias de áudio sobrepostas (controlar play/pause).

## Mobile-First e Usuário
- Interfaces devem ser responsivas e suportar controles de toque.
- Use `env(safe-area-inset-*)` para lidar com telas de smartphones.
- Evite dependências de teclado para interações principais.

## Documentação de Código
- Inclua comentários onde a lógica for não trivial.
- Para decisões arquiteturais, use ADRs em `docs/DECISIONS/`.

## Testes
- Sempre execute `npm run test:unit` após alterações significativas.
- Se não houver testes para a área alterada, adicione uma lista de verificação manual em `docs/TESTING/`.
