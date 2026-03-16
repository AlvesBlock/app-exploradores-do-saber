# Galeria Encantada

## Objetivo do modulo

`Galeria Encantada` e o modulo premium do app, apresentado no Hub como um card `Plus`.

Ele existe para funcionar como recompensa aspiracional apos a conclusao dos 4 mundos principais, oferecendo:

- album de personagens
- quiz de descoberta
- memoria por pares
- missoes diarias
- destaque diario
- economia local com `magicDust`

O catalogo usa a Disney API como fonte de conteudo dinamico, mas gameplay, textos, unlock, cache e progressao permanecem sob controle do projeto.

## Rota e regra de desbloqueio

- rota: `/galeria-encantada`
- guard de rota: bloqueia acesso direto enquanto o premium nao estiver liberado
- regra central: todos os `gameModules` precisam ter `completedAt`
- servico central: `src/services/magicGalleryProgress.service.ts`
- regra pura e testavel: `src/engine/magic-gallery/unlock.ts`

## Estados do card premium no Hub

- `locked`
  - faltam modulos obrigatorios
- `almost-unlocked`
  - resta apenas o passo final
- `just-unlocked`
  - premium liberado e celebracao ainda pendente
- `available`
  - premium liberado e pronto para entrar
- `visited`
  - premium ja acessado e com progresso persistente

## Experiencia implementada

### 1. Hub

- card premium `Plus` com visual distinto
- texto de requisito e progresso de unlock
- contador de figurinhas e `magicDust`
- overlay especial de conquista quando o premium e liberado

### 2. Home do modulo

- hero proprio com resumo de progresso
- destaque diario com reveal e bonus
- atalhos para album, memoria, quiz e missoes

### 3. Album

- grid de personagens bloqueados e desbloqueados
- raridade local do app
- progresso por colecao
- painel lateral com detalhes e CTA de reveal

### 4. Memoria

- tres niveis:
  - `spark`
  - `portal`
  - `castle`
- deck gerado a partir do catalogo normalizado
- reward ao concluir a rodada

### 5. Quiz

- perguntas de multipla escolha geradas a partir do catalogo
- foco em associar personagem, historia e colecao
- reward ao final

### 6. Missoes

- reveal do destaque diario
- vencer memoria
- concluir quiz
- revelar uma figurinha no album

## Conteudo dinamico

### Fonte externa

- `https://api.disneyapi.dev`
- acesso encapsulado em `src/services/disneyCharacterApi.service.ts`

### Estrategia de resiliencia

- seeds curadas em `src/data/magic-gallery/magicGalleryCatalog.data.ts`
- adapter para contratos internos em `src/services/magicGalleryContent.service.ts`
- cache em `localStorage`
- fallback local quando a API falha ou retorna dados insuficientes

## Arquivos principais

- `src/views/MagicGalleryView.vue`
- `src/composables/useMagicGallery.ts`
- `src/components/magic-gallery/MagicGalleryHubCard.vue`
- `src/components/magic-gallery/MagicGalleryUnlockOverlay.vue`
- `src/components/magic-gallery/MagicGalleryAlbumCard.vue`
- `src/components/magic-gallery/MagicGalleryMissionCard.vue`
- `src/services/disneyCharacterApi.service.ts`
- `src/services/magicGalleryContent.service.ts`
- `src/services/magicGalleryProgress.service.ts`
- `src/engine/magic-gallery/*.ts`
- `src/types/magic-gallery.ts`

## Persistencia

`MagicGalleryProgress` persiste:

- `unlockedAt`
- `unlockCelebrationSeenAt`
- `firstVisitedAt`
- `lastVisitedAt`
- saldo de `magicDust`
- estrelas bonus acumuladas
- ids de personagens desbloqueados
- ids vistos
- historico curto de rewards
- progresso da memoria
- progresso do quiz
- estado diario de missoes
- estado do destaque diario

## Economia

- moeda local: `magicDust`
- recompensa global: `bonusStars`
- starter pack no primeiro unlock
- reveal de personagens consome `magicDust`

## Testes automatizados adicionados

- `src/__tests__/magicGalleryUnlock.spec.ts`
- `src/__tests__/magicGalleryRewards.spec.ts`
- `src/__tests__/magicGalleryQuiz.spec.ts`
- `src/__tests__/magicGalleryMemory.spec.ts`

## Validacoes executadas

- `npm run type-check`
- `npm run test:unit -- --run`
- `npm run lint`
- `npm run build`

## Como testar manualmente

1. Criar perfil novo.
2. Confirmar card `Plus` bloqueado no Hub.
3. Concluir os 4 modulos principais.
4. Voltar ao Hub e validar overlay de unlock.
5. Entrar em `/galeria-encantada`.
6. Revelar o destaque diario.
7. Jogar uma rodada da memoria.
8. Concluir um quiz.
9. Resgatar uma missao.
10. Revelar pelo menos uma figurinha no album.
11. Recarregar a pagina e validar persistencia.

## Riscos e pendencias reais

- a qualidade do payload da Disney API varia entre personagens
- imagens remotas podem falhar dependendo da origem externa
- o modulo continua local-first, sem sincronizacao entre dispositivos
