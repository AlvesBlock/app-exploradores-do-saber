# Sistema de Quiz e Progressao

## Objetivo

Transformar os modulos do app principal em uma experiencia infantil consistente, curta, responsiva e memoravel.

## Estrategia adotada

Foi adotado um modelo hibrido entre trilha guiada e randomizacao controlada:

- cada modulo possui um plano de 5 dias
- cada sessao tem 4 perguntas
- cada sessao mistura:
  - perguntas novas do dia atual
  - revisao de erros anteriores
  - itens frescos ainda pouco vistos

Essa arquitetura foi escolhida porque:

- evita a sensacao de quiz sempre igual
- mantem progressao percebida
- nao cria bloqueio artificial por calendario
- funciona bem para criancas em rotinas diferentes

## Regras de progressao

- para subir de dia, a crianca precisa acertar pelo menos 75 por cento da sessao
- sessao com menos de 75 por cento pode ser repetida com nova combinacao de perguntas
- concluir o quinto dia fecha o modulo
- concluir um modulo desbloqueia o proximo

## Persistencia

Cada `ModuleProgress` guarda:

- dias concluidos
- estrelas ganhas
- total de respostas e acertos
- melhor precisao
- streak atual
- ids dominados
- ids para revisao
- memoria curta de perguntas recentes
- sessao ativa em andamento
- ultimo resumo de sessao
- data de conclusao do modulo

## Feedback e celebracao

- resposta correta:
  - audio curto de acerto
  - feedback visual inline
  - estrelas da resposta
- resposta incorreta:
  - audio curto de erro
  - explicacao e destaque da alternativa correta
- conclusao de modulo:
  - confete
  - audio de celebracao
  - resumo persistido
  - desbloqueio do proximo modulo quando houver

## Identidade visual do quiz

O quiz agora usa linguagem visual propria:

- badge de pergunta
- card principal com contexto do mundo
- alternativas grandes e legiveis
- feedback inline positivo ou negativo
- resumo de sessao com metricas simples
- tela final de modulo com recompensa e CTA claro

## Arquivos centrais

- `src/views/ModuleView.vue`
- `src/components/quiz/QuizOptionCard.vue`
- `src/data/modules/moduleCatalog.data.ts`
- `src/data/modules/moduleQuestionBank.data.ts`
- `src/services/moduleQuiz.service.ts`
- `src/services/moduleProgress.service.ts`
- `src/services/audio.service.ts`
- `src/services/celebration.service.ts`

## Trade-offs

- a trilha de 5 dias nao depende de data real
  - isso reduz frustracao e simplifica retomada
- o app ainda usa `localStorage`
  - suficiente para deploy web simples, mas sem sincronizacao em nuvem

