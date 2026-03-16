# Game Design - Runner Educativo

## Filosofia do jogo

O runner precisa ensinar pela propria jogabilidade. A experiencia final nao trata mais a pista como uma animacao rapida com troca de icones; ela trabalha com leitura, escolha de lane, risco vs recompensa e fechamento claro de round.

## Loop principal atual

1. Escolher round e veiculo no overlay inicial.
2. Entrar em um round com abertura controlada e pedagogica.
3. Coletar itens bons para bater a meta e carregar o escudo.
4. Decidir quando usar escudo para:
   - bloquear uma colisao
   - qualificar coletas arriscadas/especiais
5. Sobreviver ate o fim do percurso.
6. Receber score, moedas, creditos, card educativo e progresso persistente.

## Classes de coletavel

### `good`
- contam para meta
- geram recompensa direta
- ensinam o loop base

### `bad`
- nao contam para meta
- podem render pouco valor, mas geram penalidade de score/eco
- evitam que "qualquer coleta seja boa"

### `risky`
- valem mais quando coletados com escudo
- sem escudo entram como manejo incorreto

### `special`
- sao os itens de maior valor
- normalmente exigem escudo para valer plenamente
- reforcam a decisao de timing

## Escudo

- carregado pela coleta
- ativacao manual
- uso duplo:
  - defesa contra um hit
  - coleta segura de itens arriscados/especiais
- deixou de ser apenas um "botao de emergencia"

## Obstaculos

- agora possuem severidade (`minor` / `major`)
- continuam simples visualmente, mas com papel melhor definido:
  - custos de score diferentes
  - telegraph visual diferente
  - leitura de lane mais clara

## Curva de aprendizado

- primeiros segundos:
  - mais coleta do que perigo
  - leitura da pista e do HUD
- meio do round:
  - spawn alterna respiro, decisao e pressao
  - itens arriscados aparecem como escolha real
- fim do round:
  - densidade e ritmo sobem
  - o jogador precisa converter aprendizado em execucao

## Fechamento de ciclo

- `victory`
  - score final
  - recompensa
  - card educativo
  - opcao de avancar
- `gameover`
  - motivo de derrota legivel
  - stats de round
  - card educativo contextual
  - loop de tentativa/replay claro
