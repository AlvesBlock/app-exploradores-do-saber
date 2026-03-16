import type { ModuleId, ModuleQuestion, QuestionDifficulty } from '@/types/module'

function rewardFor(difficulty: QuestionDifficulty) {
  if (difficulty === 'challenge') return 3
  if (difficulty === 'core') return 2
  return 1
}

function question(input: {
  moduleId: ModuleId
  day: number
  suffix: string
  emoji: string
  difficulty: QuestionDifficulty
  title: string
  prompt: string
  tip: string
  options: ModuleQuestion['options']
  correctAnswer: string | number
  successMessage: string
  errorMessage: string
  explanation: string
  rewardStars?: number
}): ModuleQuestion {
  return {
    id: `${input.moduleId}-${input.suffix}`,
    moduleId: input.moduleId,
    day: input.day,
    difficulty: input.difficulty,
    emoji: input.emoji,
    title: input.title,
    prompt: input.prompt,
    tip: input.tip,
    options: input.options,
    correctAnswer: input.correctAnswer,
    successMessage: input.successMessage,
    errorMessage: input.errorMessage,
    explanation: input.explanation,
    rewardStars: input.rewardStars ?? rewardFor(input.difficulty)
  }
}

export const moduleQuestionBank: ModuleQuestion[] = [
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'vizinho-antes',
    emoji: '👣',
    difficulty: 'warmup',
    title: 'Quem vem antes?',
    prompt: 'Qual numero vem antes de 21?',
    tip: 'Pense em um passo para tras.',
    options: [
      { label: '20', value: 20, emoji: '✅' },
      { label: '22', value: 22, emoji: '↗️' },
      { label: '19', value: 19, emoji: '🤔' }
    ],
    correctAnswer: 20,
    successMessage: 'Boa! 20 vem antes de 21.',
    errorMessage: 'Quase. Ande um numero para tras.',
    explanation: 'O antecessor e o numero que aparece logo antes.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'vizinho-depois',
    emoji: '🚀',
    difficulty: 'warmup',
    title: 'Quem vem depois?',
    prompt: 'Qual numero aparece logo depois de 34?',
    tip: 'Conte mais um.',
    options: [
      { label: '35', value: 35, emoji: '⭐' },
      { label: '33', value: 33, emoji: '⬅️' },
      { label: '36', value: 36, emoji: '⚡' }
    ],
    correctAnswer: 35,
    successMessage: 'Isso! 35 e o sucessor de 34.',
    errorMessage: 'Tente contar um numero a mais.',
    explanation: 'O sucessor vem logo depois do numero escolhido.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'contagem-baloes',
    emoji: '🎈',
    difficulty: 'warmup',
    title: 'Contando baloes',
    prompt: 'Ana tem 7 baloes e ganha mais 1. Com quantos fica?',
    tip: 'Some 1 ao total.',
    options: [
      { label: '8', value: 8, emoji: '🎉' },
      { label: '6', value: 6, emoji: '🌧️' },
      { label: '9', value: 9, emoji: '🎪' }
    ],
    correctAnswer: 8,
    successMessage: 'Perfeito! 7 mais 1 e igual a 8.',
    errorMessage: 'Quase. Some so mais um balao.',
    explanation: 'Adicionar 1 significa andar uma casa na contagem.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'ordem-crescente',
    emoji: '📈',
    difficulty: 'core',
    title: 'Sequencia certa',
    prompt: 'Qual opcao esta em ordem crescente?',
    tip: 'Comece no menor numero.',
    options: [
      { label: '9, 12, 18, 37', value: 'a', emoji: '🟢' },
      { label: '18, 12, 9, 37', value: 'b', emoji: '🟡' },
      { label: '37, 18, 12, 9', value: 'c', emoji: '🔴' }
    ],
    correctAnswer: 'a',
    successMessage: 'Muito bem! A sequencia cresce do menor para o maior.',
    errorMessage: 'Observe qual lista comeca no menor numero.',
    explanation: 'Ordem crescente vai do menor para o maior.'
  }),
  question({
    moduleId: 'math',
    day: 2,
    suffix: 'comparacao-pirulitos',
    emoji: '🍭',
    difficulty: 'core',
    title: 'Quem tem mais?',
    prompt: 'Leo tem 12 pirulitos e Bia tem 15. Quem tem mais?',
    tip: 'Compare 12 e 15.',
    options: [
      { label: 'Leo', value: 'leo', emoji: '🧒' },
      { label: 'Bia', value: 'bia', emoji: '👧' },
      { label: 'Os dois', value: 'iguais', emoji: '🤝' }
    ],
    correctAnswer: 'bia',
    successMessage: 'Isso! 15 e maior que 12.',
    errorMessage: 'Olhe para o maior numero.',
    explanation: 'Quando comparamos, o numero maior indica maior quantidade.'
  }),
  question({
    moduleId: 'math',
    day: 2,
    suffix: 'calendario-dia',
    emoji: '📅',
    difficulty: 'warmup',
    title: 'Dia seguinte',
    prompt: 'Se hoje e quarta-feira, amanha sera:',
    tip: 'Pense no proximo dia da semana.',
    options: [
      { label: 'Terca-feira', value: 'terca', emoji: '⬅️' },
      { label: 'Quinta-feira', value: 'quinta', emoji: '➡️' },
      { label: 'Sabado', value: 'sabado', emoji: '🌈' }
    ],
    correctAnswer: 'quinta',
    successMessage: 'Boa! Depois de quarta vem quinta.',
    errorMessage: 'Quase. Procure o dia que vem logo depois.',
    explanation: 'Os dias da semana seguem uma ordem.'
  }),
  question({
    moduleId: 'math',
    day: 2,
    suffix: 'dezena-unidade',
    emoji: '🧱',
    difficulty: 'core',
    title: 'Montando 24',
    prompt: 'O numero 24 tem quantas dezenas e unidades?',
    tip: 'Separe em 20 e 4.',
    options: [
      { label: '2 dezenas e 4 unidades', value: '2d4u', emoji: '✅' },
      { label: '4 dezenas e 2 unidades', value: '4d2u', emoji: '🔁' },
      { label: '24 dezenas', value: '24d', emoji: '❌' }
    ],
    correctAnswer: '2d4u',
    successMessage: 'Muito bem! 24 tem 2 dezenas e 4 unidades.',
    errorMessage: 'Tente separar o numero em grupos de dez.',
    explanation: 'A dezena vale 10, e as unidades completam o numero.'
  }),
  question({
    moduleId: 'math',
    day: 3,
    suffix: 'adicao-passaros',
    emoji: '🐦',
    difficulty: 'core',
    title: 'Passaros na arvore',
    prompt: 'Havia 9 passaros na arvore. Chegaram mais 4. Quantos ficaram?',
    tip: 'Some 9 + 4.',
    options: [
      { label: '12', value: 12, emoji: '🌿' },
      { label: '13', value: 13, emoji: '🎵' },
      { label: '14', value: 14, emoji: '☁️' }
    ],
    correctAnswer: 13,
    successMessage: 'Boa conta! 9 mais 4 e 13.',
    errorMessage: 'Conte 4 numeros depois do 9.',
    explanation: 'Podemos somar continuando a contagem.'
  }),
  question({
    moduleId: 'math',
    day: 3,
    suffix: 'subtracao-lapis',
    emoji: '✏️',
    difficulty: 'core',
    title: 'Lapis que sobraram',
    prompt: 'Uma caixa tinha 14 lapis. 3 foram usados. Quantos sobraram?',
    tip: 'Faca 14 menos 3.',
    options: [
      { label: '10', value: 10, emoji: '📦' },
      { label: '11', value: 11, emoji: '👍' },
      { label: '12', value: 12, emoji: '🌀' }
    ],
    correctAnswer: 11,
    successMessage: 'Muito bem! 14 menos 3 e 11.',
    errorMessage: 'Quase. Tire 3 da quantidade inicial.',
    explanation: 'Subtrair mostra o que sobra depois de tirar uma parte.'
  }),
  question({
    moduleId: 'math',
    day: 3,
    suffix: 'padrao-sequencia',
    emoji: '🧩',
    difficulty: 'challenge',
    title: 'Qual numero falta?',
    prompt: 'Complete a sequencia: 5, 10, 15, __, 25.',
    tip: 'A sequencia cresce de 5 em 5.',
    options: [
      { label: '18', value: 18, emoji: '🤔' },
      { label: '20', value: 20, emoji: '✨' },
      { label: '30', value: 30, emoji: '🚀' }
    ],
    correctAnswer: 20,
    successMessage: 'Isso! O proximo numero e 20.',
    errorMessage: 'Observe o salto entre os numeros.',
    explanation: 'Quando o padrao soma 5, cada termo cresce do mesmo jeito.'
  }),
  question({
    moduleId: 'math',
    day: 4,
    suffix: 'problema-cestas',
    emoji: '🧺',
    difficulty: 'challenge',
    title: 'Cestas de frutas',
    prompt: 'Duas cestas tem 6 frutas cada. Quantas frutas ha ao todo?',
    tip: 'Junte 6 + 6.',
    options: [
      { label: '10', value: 10, emoji: '🍌' },
      { label: '12', value: 12, emoji: '🍎' },
      { label: '14', value: 14, emoji: '🍇' }
    ],
    correctAnswer: 12,
    successMessage: 'Perfeito! Duas cestas de 6 formam 12.',
    errorMessage: 'Some as frutas das duas cestas.',
    explanation: 'Quando juntamos quantidades iguais, podemos somar os grupos.'
  }),
  question({
    moduleId: 'math',
    day: 4,
    suffix: 'relogio-hora',
    emoji: '🕒',
    difficulty: 'core',
    title: 'Hora da brincadeira',
    prompt: 'Se a aula termina as 3 horas, qual numero aparece no relogio?',
    tip: 'Procure o numero 3.',
    options: [
      { label: '2', value: 2, emoji: '🟡' },
      { label: '3', value: 3, emoji: '🟢' },
      { label: '6', value: 6, emoji: '🔵' }
    ],
    correctAnswer: 3,
    successMessage: 'Isso! 3 horas aponta para o numero 3.',
    errorMessage: 'Lembre que a hora inteira aponta para um numero.',
    explanation: 'Em horas cheias, o ponteiro pequeno aponta para o numero da hora.'
  }),
  question({
    moduleId: 'math',
    day: 4,
    suffix: 'dobro-sanduiches',
    emoji: '🥪',
    difficulty: 'challenge',
    title: 'Dobro gostoso',
    prompt: 'Se 1 prato tem 4 sanduiches, o dobro e:',
    tip: 'Dobro e duas vezes a mesma quantidade.',
    options: [
      { label: '6', value: 6, emoji: '🍽️' },
      { label: '8', value: 8, emoji: '😋' },
      { label: '10', value: 10, emoji: '🎈' }
    ],
    correctAnswer: 8,
    successMessage: 'Muito bem! O dobro de 4 e 8.',
    errorMessage: 'Tente repetir a mesma quantidade duas vezes.',
    explanation: 'Dobro significa somar a quantidade com ela mesma.'
  }),
  question({
    moduleId: 'math',
    day: 5,
    suffix: 'desafio-onibus',
    emoji: '🚌',
    difficulty: 'challenge',
    title: 'Viagem da escola',
    prompt: 'Entraram 7 criancas no onibus e depois mais 5. Quantas criancas havia?',
    tip: 'Some 7 com 5.',
    options: [
      { label: '11', value: 11, emoji: '🌥️' },
      { label: '12', value: 12, emoji: '🎒' },
      { label: '13', value: 13, emoji: '🛣️' }
    ],
    correctAnswer: 12,
    successMessage: 'Boa! 7 mais 5 e igual a 12.',
    errorMessage: 'Quase. Conte 5 numeros depois do 7.',
    explanation: 'Problemas do cotidiano tambem usam soma.'
  }),
  question({
    moduleId: 'math',
    day: 5,
    suffix: 'desafio-menor',
    emoji: '🔍',
    difficulty: 'core',
    title: 'Qual e o menor?',
    prompt: 'Entre 41, 14 e 24, qual e o menor numero?',
    tip: 'Compare a primeira dezena de cada numero.',
    options: [
      { label: '41', value: 41, emoji: '🟥' },
      { label: '14', value: 14, emoji: '🟩' },
      { label: '24', value: 24, emoji: '🟦' }
    ],
    correctAnswer: 14,
    successMessage: 'Isso! 14 e o menor da lista.',
    errorMessage: 'Olhe quem tem a menor dezena.',
    explanation: 'Para comparar numeros de dois algarismos, olhamos dezenas e depois unidades.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'lugar-estudo',
    emoji: '🏫',
    difficulty: 'warmup',
    title: 'Lugar de aprender',
    prompt: 'Em qual lugar estudamos com professores e colegas?',
    tip: 'Pense no lugar das aulas.',
    options: [
      { label: 'Escola', value: 'escola', emoji: '📚' },
      { label: 'Padaria', value: 'padaria', emoji: '🥖' },
      { label: 'Cinema', value: 'cinema', emoji: '🎬' }
    ],
    correctAnswer: 'escola',
    successMessage: 'Perfeito! A escola e um lugar de aprendizagem.',
    errorMessage: 'Procure o lugar onde acontecem as aulas.',
    explanation: 'A escola reune estudantes, professores e materiais de estudo.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'rua-comercial',
    emoji: '🏪',
    difficulty: 'warmup',
    title: 'Rua movimentada',
    prompt: 'Uma rua com muitas lojas e compras e uma rua:',
    tip: 'Observe onde as pessoas compram.',
    options: [
      { label: 'Comercial', value: 'comercial', emoji: '🛍️' },
      { label: 'Rural', value: 'rural', emoji: '🌾' },
      { label: 'Vazia', value: 'vazia', emoji: '🌫️' }
    ],
    correctAnswer: 'comercial',
    successMessage: 'Boa! Ruas com lojas sao comerciais.',
    errorMessage: 'Quase. Pense nas ruas de compras.',
    explanation: 'Ruas comerciais concentram lojas e servicos.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'faixa-pedestre',
    emoji: '🚸',
    difficulty: 'core',
    title: 'Travessia segura',
    prompt: 'Onde e mais seguro atravessar a rua?',
    tip: 'Procure o lugar marcado para pedestres.',
    options: [
      { label: 'Na faixa de pedestres', value: 'faixa', emoji: '✅' },
      { label: 'No meio da rua', value: 'meio', emoji: '⚠️' },
      { label: 'Entre carros parados', value: 'carros', emoji: '🚗' }
    ],
    correctAnswer: 'faixa',
    successMessage: 'Isso! A faixa ajuda na travessia segura.',
    errorMessage: 'Escolha o local pensado para pedestres.',
    explanation: 'A faixa organiza a travessia e aumenta a seguranca.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'mapa-simbolo',
    emoji: '🧭',
    difficulty: 'core',
    title: 'Lendo o mapa',
    prompt: 'No mapa, um desenho pequeno que representa um lugar e chamado de:',
    tip: 'Pense no sinal usado para mostrar algo.',
    options: [
      { label: 'Simbolo', value: 'simbolo', emoji: '🗺️' },
      { label: 'Nuvem', value: 'nuvem', emoji: '☁️' },
      { label: 'Janela', value: 'janela', emoji: '🪟' }
    ],
    correctAnswer: 'simbolo',
    successMessage: 'Muito bem! Os mapas usam simbolos.',
    errorMessage: 'Quase. O mapa usa pequenos sinais para representar lugares.',
    explanation: 'Simbolos ajudam a resumir informacoes no mapa.'
  }),
  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'meio-transporte',
    emoji: '🚲',
    difficulty: 'core',
    title: 'Como chegar?',
    prompt: 'Qual meio de transporte nao polui e ainda faz exercicio?',
    tip: 'Pense no transporte movido por pedal.',
    options: [
      { label: 'Bicicleta', value: 'bicicleta', emoji: '🌿' },
      { label: 'Moto', value: 'moto', emoji: '🏍️' },
      { label: 'Caminhao', value: 'caminhao', emoji: '🚚' }
    ],
    correctAnswer: 'bicicleta',
    successMessage: 'Boa! A bicicleta e uma escolha sustentavel.',
    errorMessage: 'Procure o transporte que usa pedal.',
    explanation: 'Alguns deslocamentos podem ser mais leves para o ambiente.'
  }),
  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'bairro-cuidado',
    emoji: '🏡',
    difficulty: 'warmup',
    title: 'Cuidando do bairro',
    prompt: 'Qual atitude ajuda a manter o bairro bonito?',
    tip: 'Escolha a atitude de cuidado.',
    options: [
      { label: 'Jogar lixo na lixeira', value: 'lixeira', emoji: '🗑️' },
      { label: 'Rasgar plantas da praca', value: 'plantas', emoji: '🌱' },
      { label: 'Pichar a parede da escola', value: 'pichar', emoji: '🎨' }
    ],
    correctAnswer: 'lixeira',
    successMessage: 'Muito bem! Cuidar do lixo ajuda o bairro.',
    errorMessage: 'Pense em uma atitude de cuidado e respeito.',
    explanation: 'Espacos coletivos ficam melhores quando todos colaboram.'
  }),
  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'rua-residencial',
    emoji: '🏠',
    difficulty: 'warmup',
    title: 'Lugar de morar',
    prompt: 'Uma rua com muitas casas e poucos comercios e uma rua:',
    tip: 'Pense em onde as pessoas moram.',
    options: [
      { label: 'Residencial', value: 'residencial', emoji: '🛏️' },
      { label: 'Industrial', value: 'industrial', emoji: '🏭' },
      { label: 'Aeroportuaria', value: 'aeroporto', emoji: '✈️' }
    ],
    correctAnswer: 'residencial',
    successMessage: 'Isso! Ruas com casas sao residenciais.',
    errorMessage: 'Quase. Procure a opcao ligada a moradia.',
    explanation: 'Areas residenciais concentram casas e predios de moradia.'
  }),
  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'direcao-esquerda',
    emoji: '⬅️',
    difficulty: 'core',
    title: 'Virando na esquina',
    prompt: 'Se a seta aponta para a esquerda, para que lado voce deve virar?',
    tip: 'Siga a seta.',
    options: [
      { label: 'Esquerda', value: 'esquerda', emoji: '⬅️' },
      { label: 'Direita', value: 'direita', emoji: '➡️' },
      { label: 'Para tras', value: 'tras', emoji: '↩️' }
    ],
    correctAnswer: 'esquerda',
    successMessage: 'Boa! A seta levou voce para a esquerda.',
    errorMessage: 'Olhe o lado para onde a seta aponta.',
    explanation: 'Sinais de direcao ajudam a orientar percursos.'
  }),
  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'perto-longe',
    emoji: '📍',
    difficulty: 'warmup',
    title: 'Perto ou longe?',
    prompt: 'Se o mercado fica na esquina de casa, ele esta:',
    tip: 'Esquina e um lugar proximo.',
    options: [
      { label: 'Perto', value: 'perto', emoji: '😊' },
      { label: 'Longe', value: 'longe', emoji: '🚀' },
      { label: 'Em outro pais', value: 'pais', emoji: '🌍' }
    ],
    correctAnswer: 'perto',
    successMessage: 'Isso! A esquina fica pertinho.',
    errorMessage: 'Pense na distancia curta da esquina.',
    explanation: 'Palavras de localizacao ajudam a descrever distancias.'
  }),
  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'mapa-rotas',
    emoji: '🛤️',
    difficulty: 'challenge',
    title: 'Escolha a rota',
    prompt: 'Para chegar da casa ate a escola com seguranca, a melhor rota e a que passa:',
    tip: 'Procure a rota com calcada e faixa.',
    options: [
      { label: 'Pela calcada e faixa de pedestres', value: 'segura', emoji: '🟢' },
      { label: 'Pelo meio da avenida', value: 'avenida', emoji: '🔴' },
      { label: 'Entre carros estacionados', value: 'carros', emoji: '🟠' }
    ],
    correctAnswer: 'segura',
    successMessage: 'Muito bem! A rota segura protege pedestres.',
    errorMessage: 'Escolha a rota com espacos pensados para pedestres.',
    explanation: 'Mapear o caminho ajuda a tomar decisoes mais seguras.'
  }),
  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'acessibilidade-rampa',
    emoji: '♿',
    difficulty: 'core',
    title: 'Cidade para todos',
    prompt: 'Uma rampa na entrada de um predio ajuda principalmente:',
    tip: 'Pense em quem precisa de acesso sem degrau.',
    options: [
      {
        label: 'Acesso de todos, inclusive cadeira de rodas e carrinho',
        value: 'rampa',
        emoji: '🤝'
      },
      { label: 'Apenas carros grandes', value: 'carros', emoji: '🚗' },
      { label: 'Somente bicicletas', value: 'bike', emoji: '🚲' }
    ],
    correctAnswer: 'rampa',
    successMessage: 'Perfeito! Rampas melhoram a acessibilidade.',
    errorMessage: 'Quase. Pense em quem precisa entrar sem subir degraus.',
    explanation: 'Acessibilidade deixa os espacos mais inclusivos.'
  }),
  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'paisagem-natural',
    emoji: '🌳',
    difficulty: 'warmup',
    title: 'O que faz parte da natureza?',
    prompt: 'Qual elemento faz parte de uma paisagem natural?',
    tip: 'Pense em algo que nasce na natureza.',
    options: [
      { label: 'Arvore', value: 'arvore', emoji: '🌳' },
      { label: 'Semaforo', value: 'semaforo', emoji: '🚦' },
      { label: 'Escada rolante', value: 'escada', emoji: '🛗' }
    ],
    correctAnswer: 'arvore',
    successMessage: 'Isso! A arvore faz parte da paisagem natural.',
    errorMessage: 'Procure um elemento que nao foi construido por pessoas.',
    explanation: 'Paisagens naturais incluem plantas, rios, montanhas e ceu.'
  }),
  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'servico-publico',
    emoji: '🚒',
    difficulty: 'challenge',
    title: 'Quem ajuda em emergencias?',
    prompt: 'Qual servico publico ajuda a apagar incendios?',
    tip: 'Pense no time que usa caminhao vermelho.',
    options: [
      { label: 'Bombeiros', value: 'bombeiros', emoji: '🚒' },
      { label: 'Bibliotecarios', value: 'biblioteca', emoji: '📚' },
      { label: 'Jardineiros', value: 'jardim', emoji: '🌷' }
    ],
    correctAnswer: 'bombeiros',
    successMessage: 'Boa! Bombeiros ajudam em incendios e resgates.',
    errorMessage: 'Observe quem atua em emergencias com caminhao especial.',
    explanation: 'Servicos publicos mantem a cidade funcionando e protegida.'
  }),
  question({
    moduleId: 'geography',
    day: 5,
    suffix: 'desafio-ponto-referencia',
    emoji: '📌',
    difficulty: 'challenge',
    title: 'Ponto de referencia',
    prompt: 'Uma praca grande perto de casa pode ajudar como:',
    tip: 'Pense em algo que ajuda a se orientar.',
    options: [
      { label: 'Ponto de referencia', value: 'referencia', emoji: '🧭' },
      { label: 'Brinquedo invisivel', value: 'invisivel', emoji: '🎲' },
      { label: 'Nome secreto da rua', value: 'segredo', emoji: '🕵️' }
    ],
    correctAnswer: 'referencia',
    successMessage: 'Muito bem! Pontos de referencia ajudam a localizar lugares.',
    errorMessage: 'Quase. Pense no que ajuda a reconhecer o caminho.',
    explanation: 'Pontos marcantes facilitam a orientacao pela cidade.'
  }),
  question({
    moduleId: 'geography',
    day: 5,
    suffix: 'desafio-transporte-publico',
    emoji: '🚍',
    difficulty: 'core',
    title: 'Viagem coletiva',
    prompt: 'Qual transporte leva muitas pessoas ao mesmo tempo pela cidade?',
    tip: 'Pense no veiculo grande com varias poltronas.',
    options: [
      { label: 'Onibus', value: 'onibus', emoji: '🚍' },
      { label: 'Patins', value: 'patins', emoji: '🛼' },
      { label: 'Patinete de brinquedo', value: 'patinete', emoji: '🛴' }
    ],
    correctAnswer: 'onibus',
    successMessage: 'Isso! O onibus e um transporte coletivo.',
    errorMessage: 'Escolha o veiculo que transporta muita gente.',
    explanation: 'Transportes coletivos ajudam muitas pessoas a se deslocar.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'cientista-laboratorio',
    emoji: '🧪',
    difficulty: 'warmup',
    title: 'Lugar de pesquisa',
    prompt: 'Qual lugar pode ser usado para fazer experiencias cientificas?',
    tip: 'Pense em um local de observacao e testes.',
    options: [
      { label: 'Laboratorio', value: 'laboratorio', emoji: '🔬' },
      { label: 'Palco de show', value: 'palco', emoji: '🎤' },
      { label: 'Piscina de bolinhas', value: 'piscina', emoji: '🟠' }
    ],
    correctAnswer: 'laboratorio',
    successMessage: 'Boa! Laboratorios sao usados para pesquisar.',
    errorMessage: 'Procure o lugar onde cientistas observam e testam.',
    explanation: 'Nem toda ciencia acontece em laboratorio, mas ele e um espaco comum de pesquisa.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'ser-vivo',
    emoji: '🌱',
    difficulty: 'warmup',
    title: 'Quem cresce?',
    prompt: 'Qual destas opcoes e um ser vivo?',
    tip: 'Procure quem nasce, cresce e precisa de cuidados.',
    options: [
      { label: 'Planta', value: 'planta', emoji: '🌱' },
      { label: 'Pedra', value: 'pedra', emoji: '🪨' },
      { label: 'Copo', value: 'copo', emoji: '🥤' }
    ],
    correctAnswer: 'planta',
    successMessage: 'Isso! A planta e um ser vivo.',
    errorMessage: 'Quase. Escolha quem cresce e precisa de agua.',
    explanation: 'Seres vivos se desenvolvem e interagem com o ambiente.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'metodo-observar',
    emoji: '👀',
    difficulty: 'core',
    title: 'Primeiro passo',
    prompt: 'Antes de responder uma pergunta cientifica, o melhor primeiro passo e:',
    tip: 'Comece olhando com atencao.',
    options: [
      { label: 'Observar', value: 'observar', emoji: '👀' },
      { label: 'Inventar sem olhar', value: 'inventar', emoji: '🎭' },
      { label: 'Esconder o material', value: 'esconder', emoji: '🙈' }
    ],
    correctAnswer: 'observar',
    successMessage: 'Muito bem! Observar ajuda a descobrir pistas.',
    errorMessage: 'Pense em como a curiosidade comeca.',
    explanation: 'A observacao e uma etapa importante da investigacao.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'sentido-escuta',
    emoji: '👂',
    difficulty: 'core',
    title: 'Qual sentido usamos?',
    prompt: 'Para ouvir o canto de um passaro usamos:',
    tip: 'Pense no sentido da audicao.',
    options: [
      { label: 'Ouvido', value: 'ouvido', emoji: '👂' },
      { label: 'Nariz', value: 'nariz', emoji: '👃' },
      { label: 'Joelho', value: 'joelho', emoji: '🦵' }
    ],
    correctAnswer: 'ouvido',
    successMessage: 'Boa! Ouvimos com os ouvidos.',
    errorMessage: 'Qual parte do corpo ajuda a escutar sons?',
    explanation: 'Os sentidos ajudam a perceber o mundo.'
  }),
  question({
    moduleId: 'science',
    day: 2,
    suffix: 'estado-agua',
    emoji: '💧',
    difficulty: 'core',
    title: 'Agua no copo',
    prompt: 'A agua dentro do copo esta em qual estado?',
    tip: 'Pense na agua como ela aparece no dia a dia.',
    options: [
      { label: 'Liquido', value: 'liquido', emoji: '💧' },
      { label: 'Solido', value: 'solido', emoji: '🧊' },
      { label: 'Gasoso', value: 'gasoso', emoji: '☁️' }
    ],
    correctAnswer: 'liquido',
    successMessage: 'Isso! No copo, a agua esta liquida.',
    errorMessage: 'Observe a forma da agua no recipiente.',
    explanation: 'Liquidos se adaptam ao formato do recipiente.'
  }),
  question({
    moduleId: 'science',
    day: 2,
    suffix: 'objeto-imanta',
    emoji: '🧲',
    difficulty: 'challenge',
    title: 'O que o ima puxa?',
    prompt: 'Qual objeto pode ser puxado por um ima?',
    tip: 'Pense em metal.',
    options: [
      { label: 'Clips de metal', value: 'clips', emoji: '📎' },
      { label: 'Algodao', value: 'algodao', emoji: '☁️' },
      { label: 'Papel colorido', value: 'papel', emoji: '📄' }
    ],
    correctAnswer: 'clips',
    successMessage: 'Muito bem! Metais como clips podem ser atraidos.',
    errorMessage: 'Escolha o objeto metalico.',
    explanation: 'Imas atraem alguns metais.'
  }),
  question({
    moduleId: 'science',
    day: 2,
    suffix: 'mistura-separacao',
    emoji: '🥣',
    difficulty: 'core',
    title: 'Separando a mistura',
    prompt: 'Para separar agua e areia, o melhor e:',
    tip: 'Pense em deixar a agua passar e a areia ficar.',
    options: [
      { label: 'Usar um filtro', value: 'filtro', emoji: '🫗' },
      { label: 'Soprar bem forte', value: 'soprar', emoji: '💨' },
      { label: 'Apagar a luz', value: 'luz', emoji: '💡' }
    ],
    correctAnswer: 'filtro',
    successMessage: 'Boa! O filtro ajuda a separar materiais.',
    errorMessage: 'Procure o objeto que segura a areia.',
    explanation: 'Algumas misturas podem ser separadas com filtros.'
  }),
  question({
    moduleId: 'science',
    day: 3,
    suffix: 'planta-luz',
    emoji: '☀️',
    difficulty: 'core',
    title: 'Do que a planta precisa?',
    prompt: 'Qual combinacao ajuda uma planta a crescer?',
    tip: 'Pense em cuidado diario.',
    options: [
      { label: 'Agua, luz e solo', value: 'cuidado', emoji: '🌱' },
      { label: 'Som alto e tinta', value: 'tinta', emoji: '🎨' },
      { label: 'Plastico e poeira', value: 'poeira', emoji: '🧺' }
    ],
    correctAnswer: 'cuidado',
    successMessage: 'Isso! Plantas precisam de agua, luz e solo adequado.',
    errorMessage: 'Quase. Escolha a combinacao que nutre a planta.',
    explanation: 'Seres vivos precisam de condicoes favoraveis para viver.'
  }),
  question({
    moduleId: 'science',
    day: 3,
    suffix: 'animal-habitat',
    emoji: '🐠',
    difficulty: 'warmup',
    title: 'Onde vive o peixe?',
    prompt: 'Qual e o habitat mais comum para um peixe?',
    tip: 'Pense no lugar com agua.',
    options: [
      { label: 'Rio ou lago', value: 'agua', emoji: '🌊' },
      { label: 'Deserto seco', value: 'deserto', emoji: '🏜️' },
      { label: 'Telhado da casa', value: 'telhado', emoji: '🏠' }
    ],
    correctAnswer: 'agua',
    successMessage: 'Boa! Peixes vivem em ambientes com agua.',
    errorMessage: 'Procure o local onde o peixe consegue nadar.',
    explanation: 'Cada ser vivo se adapta melhor a certos ambientes.'
  }),
  question({
    moduleId: 'science',
    day: 3,
    suffix: 'sombra-luz',
    emoji: '🌤️',
    difficulty: 'challenge',
    title: 'Quando aparece sombra?',
    prompt: 'A sombra aparece quando:',
    tip: 'Pense no encontro entre luz e objeto.',
    options: [
      {
        label: 'A luz encontra um objeto e e bloqueada',
        value: 'sombra',
        emoji: '🕶️'
      },
      { label: 'Nao existe nenhuma luz', value: 'escuro', emoji: '🌑' },
      { label: 'O objeto some magicamente', value: 'magica', emoji: '🎩' }
    ],
    correctAnswer: 'sombra',
    successMessage: 'Muito bem! A sombra surge quando a luz e bloqueada.',
    errorMessage: 'Quase. Pense em como o corpo faz sombra ao sol.',
    explanation: 'A sombra depende da luz e de um objeto no caminho.'
  }),
  question({
    moduleId: 'science',
    day: 4,
    suffix: 'reciclagem-material',
    emoji: '♻️',
    difficulty: 'core',
    title: 'Qual material e esse?',
    prompt: 'Uma garrafa de vidro pertence principalmente a qual material?',
    tip: 'Olhe para o proprio nome do objeto.',
    options: [
      { label: 'Vidro', value: 'vidro', emoji: '🍾' },
      { label: 'Papel', value: 'papel', emoji: '📄' },
      { label: 'Tecido', value: 'tecido', emoji: '🧵' }
    ],
    correctAnswer: 'vidro',
    successMessage: 'Isso! Garrafa de vidro pertence ao grupo do vidro.',
    errorMessage: 'Escolha o material do qual a garrafa e feita.',
    explanation: 'Reconhecer materiais ajuda no cuidado com o ambiente.'
  }),
  question({
    moduleId: 'science',
    day: 4,
    suffix: 'seguranca-experiencia',
    emoji: '🥽',
    difficulty: 'challenge',
    title: 'Experiencia com cuidado',
    prompt: 'Qual atitude e segura durante uma experiencia?',
    tip: 'Pense em protecao e atencao.',
    options: [
      { label: 'Seguir orientacoes e usar protecao', value: 'segura', emoji: '🥽' },
      { label: 'Misturar tudo sem perguntar', value: 'misturar', emoji: '💥' },
      { label: 'Correr pelo laboratorio', value: 'correr', emoji: '🏃' }
    ],
    correctAnswer: 'segura',
    successMessage: 'Muito bem! Ciencia tambem precisa de cuidado.',
    errorMessage: 'Procure a atitude mais responsavel.',
    explanation: 'Seguranca e parte da aprendizagem cientifica.'
  }),
  question({
    moduleId: 'science',
    day: 4,
    suffix: 'tempo-evaporacao',
    emoji: '☀️',
    difficulty: 'core',
    title: 'Roupa secando',
    prompt: 'Por que a roupa molhada seca no varal?',
    tip: 'A agua vai saindo aos poucos.',
    options: [
      { label: 'Porque a agua evapora', value: 'evapora', emoji: '💨' },
      { label: 'Porque a roupa encolhe e some', value: 'encolhe', emoji: '🪄' },
      { label: 'Porque o tecido bebe a agua para sempre', value: 'bebe', emoji: '🧃' }
    ],
    correctAnswer: 'evapora',
    successMessage: 'Boa! A agua evapora e a roupa seca.',
    errorMessage: 'Pense no que acontece com a agua ao sol e ao vento.',
    explanation: 'Evaporacao e quando o liquido passa aos poucos para o ar.'
  }),
  question({
    moduleId: 'science',
    day: 5,
    suffix: 'desafio-solido',
    emoji: '🧊',
    difficulty: 'challenge',
    title: 'Gelo no copo',
    prompt: 'Quando a agua vira gelo, ela fica em estado:',
    tip: 'Pense em algo durinho e frio.',
    options: [
      { label: 'Solido', value: 'solido', emoji: '🧊' },
      { label: 'Liquido', value: 'liquido', emoji: '💧' },
      { label: 'Gasoso', value: 'gasoso', emoji: '☁️' }
    ],
    correctAnswer: 'solido',
    successMessage: 'Isso! O gelo e agua em estado solido.',
    errorMessage: 'Observe como o gelo fica firme.',
    explanation: 'A materia pode mudar de estado com temperatura.'
  }),
  question({
    moduleId: 'science',
    day: 5,
    suffix: 'desafio-ciclo',
    emoji: '🔄',
    difficulty: 'challenge',
    title: 'Ciencia em movimento',
    prompt: 'Qual atitude combina com um pequeno cientista?',
    tip: 'Pense em curiosidade e cuidado.',
    options: [
      { label: 'Observar, perguntar e testar com seguranca', value: 'cientista', emoji: '🧠' },
      { label: 'Ignorar o que ve', value: 'ignorar', emoji: '🙈' },
      { label: 'Responder sem pensar', value: 'sem-pensar', emoji: '⚡' }
    ],
    correctAnswer: 'cientista',
    successMessage: 'Perfeito! Esse e o jeito curioso de aprender.',
    errorMessage: 'Escolha a atitude mais investigativa.',
    explanation: 'Curiosidade e cuidado andam juntos na ciencia.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'silabas-coelho',
    emoji: '🐰',
    difficulty: 'warmup',
    title: 'Separando a palavra',
    prompt: 'Qual e a separacao correta da palavra "coelho"?',
    tip: 'Bata palmas para cada pedacinho.',
    options: [
      { label: 'co-e-lho', value: 'b', emoji: '👏' },
      { label: 'coe-lho', value: 'a', emoji: '🎈' },
      { label: 'coel-ho', value: 'c', emoji: '🧩' }
    ],
    correctAnswer: 'b',
    successMessage: 'Muito bem! co-e-lho e a divisao correta.',
    errorMessage: 'Quase. Tente ouvir os pedacinhos da palavra.',
    explanation: 'Separar silabas ajuda a perceber os sons da palavra.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'silabas-casa',
    emoji: '🏠',
    difficulty: 'warmup',
    title: 'Quantas partes?',
    prompt: 'A palavra "casa" tem quantas silabas?',
    tip: 'Diga devagar: ca-sa.',
    options: [
      { label: '1', value: 1, emoji: '1️⃣' },
      { label: '2', value: 2, emoji: '2️⃣' },
      { label: '3', value: 3, emoji: '3️⃣' }
    ],
    correctAnswer: 2,
    successMessage: 'Boa! ca-sa tem duas silabas.',
    errorMessage: 'Fale a palavra devagar e conte.',
    explanation: 'Cada pedaco sonoro conta como uma silaba.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'letra-inicial',
    emoji: '🔤',
    difficulty: 'core',
    title: 'Som inicial',
    prompt: 'Com qual letra comeca a palavra "bola"?',
    tip: 'Ouca o primeiro som.',
    options: [
      { label: 'B', value: 'b', emoji: '🅱️' },
      { label: 'P', value: 'p', emoji: '🅿️' },
      { label: 'L', value: 'l', emoji: '🅻' }
    ],
    correctAnswer: 'b',
    successMessage: 'Isso! bola comeca com B.',
    errorMessage: 'Quase. Escute o primeiro som da palavra.',
    explanation: 'A letra inicial ajuda a identificar palavras.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'imagem-quintal',
    emoji: '🌿',
    difficulty: 'core',
    title: 'Palavra com significado',
    prompt: 'O que significa "quintal"?',
    tip: 'Pense em um espaco da casa.',
    options: [
      { label: 'Parte de tras ou ao redor da casa', value: 'quintal', emoji: '🏡' },
      { label: 'Um brinquedo com rodas', value: 'brinquedo', emoji: '🛴' },
      { label: 'Uma roupa de frio', value: 'casaco', emoji: '🧥' }
    ],
    correctAnswer: 'quintal',
    successMessage: 'Muito bem! Quintal e um espaco da casa.',
    errorMessage: 'Procure a opcao ligada a casa.',
    explanation: 'Conhecer significados amplia a leitura e a fala.'
  }),
  question({
    moduleId: 'language',
    day: 2,
    suffix: 'rima-gato',
    emoji: '🐱',
    difficulty: 'core',
    title: 'Qual palavra rima?',
    prompt: 'Qual palavra rima com "gato"?',
    tip: 'Procure um som parecido no final.',
    options: [
      { label: 'Pato', value: 'pato', emoji: '🦆' },
      { label: 'Mesa', value: 'mesa', emoji: '🪑' },
      { label: 'Sol', value: 'sol', emoji: '☀️' }
    ],
    correctAnswer: 'pato',
    successMessage: 'Boa! gato rima com pato.',
    errorMessage: 'Quase. Escute o final das palavras.',
    explanation: 'Rimas aproximam palavras com sons parecidos no final.'
  }),
  question({
    moduleId: 'language',
    day: 2,
    suffix: 'som-meio',
    emoji: '🔎',
    difficulty: 'warmup',
    title: 'Letra do meio',
    prompt: 'Qual letra aparece no meio da palavra "sol"?',
    tip: 'Observe as tres letras em ordem.',
    options: [
      { label: 'S', value: 's', emoji: '1️⃣' },
      { label: 'O', value: 'o', emoji: '2️⃣' },
      { label: 'L', value: 'l', emoji: '3️⃣' }
    ],
    correctAnswer: 'o',
    successMessage: 'Isso! O fica no meio de s-o-l.',
    errorMessage: 'Olhe a letra que esta entre as duas outras.',
    explanation: 'Perceber a posicao das letras ajuda na leitura.'
  }),
  question({
    moduleId: 'language',
    day: 2,
    suffix: 'palavra-correta',
    emoji: '📝',
    difficulty: 'challenge',
    title: 'Frase que faz sentido',
    prompt: 'Qual frase usa a palavra "coelho" de um jeito correto?',
    tip: 'Pense em algo que um coelho de verdade faria.',
    options: [
      { label: 'O coelho correu no quintal.', value: 'certa', emoji: '🐇' },
      { label: 'O quintal pulou a cenoura.', value: 'quintal', emoji: '🥕' },
      { label: 'A panela latiu para o coelho.', value: 'panela', emoji: '🍲' }
    ],
    correctAnswer: 'certa',
    successMessage: 'Perfeito! Essa frase faz sentido.',
    errorMessage: 'Escolha a frase em que as palavras combinam.',
    explanation: 'Frases com sentido mostram a funcao real das palavras.'
  })
]
