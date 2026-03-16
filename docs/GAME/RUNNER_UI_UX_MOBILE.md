# UI/UX Mobile do Runner

## Diretrizes Principais
- **Mobile-first**: interfaces adaptáveis e controles de toque.
- **Uma mão**: botões grandes, posicionados perto do polegar.
- **Tela cheia**: uso de fullscreen quando possível (API `requestFullscreen`).
- **Segurança**: respeitar `env(safe-area-inset-*)` em iPhones.

## Tela do Jogo
- HUD visível no topo com informações essenciais:
  - Vidas, moedas, progresso de coleta, distância/tempo.
- Controles em bottom-center:
  - Esquerda / Direita para mudar de faixa.
  - Botão central para ativar escudo (antigo turbo).
- Feedback tátil visual:
  - Flash verde para coletar.
  - Flash vermelho para colisões.
  - Texto de feedback temporário (“+1 moeda”, “-1 vida”).

## Overlays
- **Start overlay**: explica o objetivo e mostra stats iniciais.
- **Pause overlay**: permite retomar ou sair.
- **Fim de round**: deverá mostrar cartão educativo + ranking/resultado.

## Controles Adicionais
- **Motion control (opcional)**:
  - Permite mover com giroscópio (sensor de orientação).
  - Ativado pelo usuário com permissão.

## Estética
- Cenários representados por imagens de fundo (`runner-city-bg*.png`).
- Tipografia grande e legível.
- Uso de emojis para reforçar temas.

## Acessibilidade
- Garantir contraste legível nos textos.
- Evitar elementos muito pequenos para toque.
- Manter foco visual: não exibir muitos elementos simultâneos para não sobrecarregar a atenção.
