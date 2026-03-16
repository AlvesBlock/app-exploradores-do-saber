# Checklist de Teste Manual

## Preparacao

- [ ] Executar `npm install`
- [ ] Executar `npm run dev`
- [ ] Limpar `localStorage` para validar onboarding do zero

## Jornada principal

- [ ] Acessar `/`
- [ ] Validar landing mobile-first com CTA principal visivel
- [ ] Navegar para `/onboarding`
- [ ] Criar perfil com nome e avatar
- [ ] Confirmar redirecionamento automatico para o hub

## Hub

- [ ] Verificar avatar, estrelas totais e resumo de progresso
- [ ] Confirmar primeiro modulo desbloqueado e demais bloqueados
- [ ] Confirmar card `Plus` bloqueado no Hub
- [ ] Validar cards dos modulos em viewport mobile portrait
- [ ] Abrir pet, trocar perfil e retornar ao hub sem perder estado

## Quiz de modulo

- [ ] Abrir um modulo desbloqueado
- [ ] Ver tela de introducao com dia atual e CTA claro
- [ ] Iniciar sessao e responder uma pergunta correta
- [ ] Validar audio curto de acerto
- [ ] Responder uma pergunta errada
- [ ] Validar audio curto de erro e feedback inline
- [ ] Concluir a sessao com pelo menos 75 por cento de acerto
- [ ] Confirmar subida de dia
- [ ] Reabrir modulo e validar retomada no dia seguinte
- [ ] Concluir os 4 modulos do app e validar:
  - [ ] confete e audio de celebracao do modulo
  - [ ] card `Plus` com estado liberado
  - [ ] overlay especial da `Galeria Encantada`

## Galeria Encantada

- [ ] Entrar em `/galeria-encantada`
- [ ] Validar hero, resumo de progresso e navegacao por paineis
- [ ] Revelar o destaque diario e confirmar reward
- [ ] Abrir o album e revelar ao menos uma figurinha
- [ ] Jogar a memoria e concluir uma rodada
- [ ] Concluir um quiz premium
- [ ] Resgatar pelo menos uma missao
- [ ] Recarregar a pagina e confirmar persistencia de:
  - [ ] unlock do premium
  - [ ] `magicDust`
  - [ ] figurinhas reveladas
  - [ ] missoes
  - [ ] destaque diario

## Persistencia geral

- [ ] Recarregar a pagina no meio de uma sessao de modulo e verificar retomada segura
- [ ] Fechar e abrir o app com progresso salvo no hub
- [ ] Verificar que o pet usa as estrelas persistidas

## Pet

- [ ] Abrir `/pet`
- [ ] Dar lanche quando houver estrela suficiente
- [ ] Validar desconto de estrela no perfil
- [ ] Brincar e descansar atualizando felicidade e energia

## Responsividade e acessibilidade

- [ ] Validar Home, Onboarding, Hub, Modulo, Galeria Encantada e Pet em viewport pequena
- [ ] Verificar botoes com area de toque confortavel
- [ ] Verificar contraste de textos e estados de feedback
- [ ] Verificar leitura clara sem blocos longos demais

## Runner

- [ ] Garantir que o acesso ao Runner continua disponivel pelo hub
- [ ] Validar que a refatoracao do app principal nao removeu o modulo arcade
