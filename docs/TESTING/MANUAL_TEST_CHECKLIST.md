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
- [ ] Concluir um modulo inteiro e validar:
  - [ ] confete
  - [ ] audio de celebracao
  - [ ] estrelas persistidas
  - [ ] desbloqueio do proximo modulo

## Persistencia

- [ ] Recarregar a pagina no meio de uma sessao e verificar retomada segura
- [ ] Fechar e abrir o app com progresso salvo no hub
- [ ] Verificar que o pet usa as estrelas persistidas

## Pet

- [ ] Abrir `/pet`
- [ ] Dar lanche quando houver estrela suficiente
- [ ] Validar desconto de estrela no perfil
- [ ] Brincar e descansar atualizando felicidade e energia

## Responsividade e acessibilidade

- [ ] Validar Home, Onboarding, Hub, Modulo e Pet em viewport pequena
- [ ] Verificar botoes com area de toque confortavel
- [ ] Verificar contraste de textos e estados de feedback
- [ ] Verificar leitura clara sem blocos longos demais

## Runner

- [ ] Garantir que o acesso ao Runner continua disponivel pelo hub
- [ ] Validar que a refatoracao do app principal nao removeu o modulo arcade

