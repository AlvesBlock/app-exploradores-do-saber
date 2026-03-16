# ADR-003 - Galeria Encantada como premium desacoplado com cache externo

## Status

Aceita.

## Contexto

O projeto precisava de um modulo premium aspiracional no Hub, desbloqueado apenas apos a conclusao dos 4 mundos principais.

Ao mesmo tempo, o modulo deveria usar conteudo dinamico da Disney API sem transformar a app em cliente direto e fragil de um payload externo.

## Decisao

Adotar a `Galeria Encantada` como feature premium desacoplada do quiz principal e do Runner, com estas regras:

- rota propria: `/galeria-encantada`
- unlock centralizado em `magicGalleryProgressService.syncUnlock()`
- regra pura em `src/engine/magic-gallery/unlock.ts`
- seeds curadas locais para garantir UX consistente
- fetch por ids oficiais da Disney API em `disneyCharacterApi.service.ts`
- adapter, cache e fallback em `magicGalleryContent.service.ts`
- progresso persistido em storage proprio do premium

## Consequencias

### Positivas

- Hub passa a ter um premio claro de medio prazo
- premium fica testavel sem acoplar regra ao `HubView.vue`
- falhas da Disney API nao derrubam a feature
- o app preserva identidade propria de progressao e recompensa

### Negativas

- aumenta o numero de estados persistidos em `localStorage`
- imagens remotas continuam sujeitas a indisponibilidade externa
- o catalogo precisa de manutencao eventual nos seeds curados
