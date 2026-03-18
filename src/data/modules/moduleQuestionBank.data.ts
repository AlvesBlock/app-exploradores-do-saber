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
  // =========================================================
  // MATH — 5 dias / 3 questões por dia
  // =========================================================
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'd1-vizinho-antes',
    emoji: '👣',
    difficulty: 'warmup',
    title: 'Quem vem antes?',
    prompt: 'Qual número vem antes de 21?',
    tip: 'Pense em um passo para trás.',
    options: [
      { label: '20', value: 20, emoji: '✅' },
      { label: '22', value: 22, emoji: '↗️' },
      { label: '19', value: 19, emoji: '🤔' }
    ],
    correctAnswer: 20,
    successMessage: 'Boa! 20 vem antes de 21.',
    errorMessage: 'Quase. Ande um número para trás.',
    explanation: 'O antecessor é o número que aparece logo antes.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'd1-vizinho-depois',
    emoji: '🚀',
    difficulty: 'warmup',
    title: 'Quem vem depois?',
    prompt: 'Qual número aparece logo depois de 34?',
    tip: 'Conte mais um.',
    options: [
      { label: '35', value: 35, emoji: '⭐' },
      { label: '33', value: 33, emoji: '⬅️' },
      { label: '36', value: 36, emoji: '⚡' }
    ],
    correctAnswer: 35,
    successMessage: 'Isso! 35 é o sucessor de 34.',
    errorMessage: 'Tente contar um número a mais.',
    explanation: 'O sucessor vem logo depois do número escolhido.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'd1-contagem-baloes',
    emoji: '🎈',
    difficulty: 'core',
    title: 'Contando balões',
    prompt: 'Ana tem 7 balões e ganha mais 1. Com quantos fica?',
    tip: 'Some 1 ao total.',
    options: [
      { label: '8', value: 8, emoji: '🎉' },
      { label: '6', value: 6, emoji: '🌧️' },
      { label: '9', value: 9, emoji: '🎪' }
    ],
    correctAnswer: 8,
    successMessage: 'Perfeito! 7 mais 1 é igual a 8.',
    errorMessage: 'Quase. Some só mais um balão.',
    explanation: 'Adicionar 1 significa andar uma casa na contagem.'
  }),

  question({
    moduleId: 'math',
    day: 2,
    suffix: 'd2-comparacao-pirulitos',
    emoji: '🍭',
    difficulty: 'core',
    title: 'Quem tem mais?',
    prompt: 'Léo tem 12 pirulitos e Bia tem 15. Quem tem mais?',
    tip: 'Compare 12 e 15.',
    options: [
      { label: 'Léo', value: 'leo', emoji: '🧒' },
      { label: 'Bia', value: 'bia', emoji: '👧' },
      { label: 'Os dois', value: 'iguais', emoji: '🤝' }
    ],
    correctAnswer: 'bia',
    successMessage: 'Isso! 15 é maior que 12.',
    errorMessage: 'Olhe para o maior número.',
    explanation: 'Quando comparamos, o número maior indica maior quantidade.'
  }),
  question({
    moduleId: 'math',
    day: 2,
    suffix: 'd2-calendario-dia',
    emoji: '📅',
    difficulty: 'warmup',
    title: 'Dia seguinte',
    prompt: 'Se hoje é quarta-feira, amanhã será:',
    tip: 'Pense no próximo dia da semana.',
    options: [
      { label: 'Terça-feira', value: 'terca', emoji: '⬅️' },
      { label: 'Quinta-feira', value: 'quinta', emoji: '➡️' },
      { label: 'Sábado', value: 'sabado', emoji: '🌈' }
    ],
    correctAnswer: 'quinta',
    successMessage: 'Boa! Depois de quarta vem quinta.',
    errorMessage: 'Quase. Procure o dia que vem logo depois.',
    explanation: 'Os dias da semana seguem uma ordem.'
  }),
  question({
    moduleId: 'math',
    day: 2,
    suffix: 'd2-dezena-unidade',
    emoji: '🧱',
    difficulty: 'challenge',
    title: 'Montando 24',
    prompt: 'O número 24 tem quantas dezenas e unidades?',
    tip: 'Separe em 20 e 4.',
    options: [
      { label: '2 dezenas e 4 unidades', value: '2d4u', emoji: '✅' },
      { label: '4 dezenas e 2 unidades', value: '4d2u', emoji: '🔁' },
      { label: '24 dezenas', value: '24d', emoji: '❌' }
    ],
    correctAnswer: '2d4u',
    successMessage: 'Muito bem! 24 tem 2 dezenas e 4 unidades.',
    errorMessage: 'Tente separar o número em grupos de dez.',
    explanation: 'A dezena vale 10, e as unidades completam o número.'
  }),

  question({
    moduleId: 'math',
    day: 3,
    suffix: 'd3-adicao-passaros',
    emoji: '🐦',
    difficulty: 'core',
    title: 'Pássaros na árvore',
    prompt: 'Havia 9 pássaros na árvore. Chegaram mais 4. Quantos ficaram?',
    tip: 'Some 9 + 4.',
    options: [
      { label: '12', value: 12, emoji: '🌿' },
      { label: '13', value: 13, emoji: '🎵' },
      { label: '14', value: 14, emoji: '☁️' }
    ],
    correctAnswer: 13,
    successMessage: 'Boa conta! 9 mais 4 é 13.',
    errorMessage: 'Conte 4 números depois do 9.',
    explanation: 'Podemos somar continuando a contagem.'
  }),
  question({
    moduleId: 'math',
    day: 3,
    suffix: 'd3-subtracao-lapis',
    emoji: '✏️',
    difficulty: 'core',
    title: 'Lápis que sobraram',
    prompt: 'Uma caixa tinha 14 lápis. 3 foram usados. Quantos sobraram?',
    tip: 'Faça 14 menos 3.',
    options: [
      { label: '10', value: 10, emoji: '📦' },
      { label: '11', value: 11, emoji: '👍' },
      { label: '12', value: 12, emoji: '🌀' }
    ],
    correctAnswer: 11,
    successMessage: 'Muito bem! 14 menos 3 é 11.',
    errorMessage: 'Quase. Tire 3 da quantidade inicial.',
    explanation: 'Subtrair mostra o que sobra depois de tirar uma parte.'
  }),
  question({
    moduleId: 'math',
    day: 3,
    suffix: 'd3-padrao-sequencia',
    emoji: '🧩',
    difficulty: 'challenge',
    title: 'Qual número falta?',
    prompt: 'Complete a sequência: 5, 10, 15, __, 25.',
    tip: 'A sequência cresce de 5 em 5.',
    options: [
      { label: '18', value: 18, emoji: '🤔' },
      { label: '20', value: 20, emoji: '✨' },
      { label: '30', value: 30, emoji: '🚀' }
    ],
    correctAnswer: 20,
    successMessage: 'Isso! O próximo número é 20.',
    errorMessage: 'Observe o salto entre os números.',
    explanation: 'Quando o padrão soma 5, cada termo cresce do mesmo jeito.'
  }),

  question({
    moduleId: 'math',
    day: 4,
    suffix: 'd4-problema-cestas',
    emoji: '🧺',
    difficulty: 'challenge',
    title: 'Cestas de frutas',
    prompt: 'Duas cestas têm 6 frutas cada. Quantas frutas há ao todo?',
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
    suffix: 'd4-relogio-hora',
    emoji: '🕒',
    difficulty: 'core',
    title: 'Hora da brincadeira',
    prompt: 'Se a aula termina às 3 horas, qual número aparece no relógio?',
    tip: 'Procure o número 3.',
    options: [
      { label: '2', value: 2, emoji: '🟡' },
      { label: '3', value: 3, emoji: '🟢' },
      { label: '6', value: 6, emoji: '🔵' }
    ],
    correctAnswer: 3,
    successMessage: 'Isso! 3 horas aponta para o número 3.',
    errorMessage: 'Lembre que a hora inteira aponta para um número.',
    explanation: 'Em horas cheias, o ponteiro pequeno aponta para o número da hora.'
  }),
  question({
    moduleId: 'math',
    day: 4,
    suffix: 'd4-dobro-sanduiches',
    emoji: '🥪',
    difficulty: 'warmup',
    title: 'Dobro gostoso',
    prompt: 'Se 1 prato tem 4 sanduíches, o dobro é:',
    tip: 'Dobro é duas vezes a mesma quantidade.',
    options: [
      { label: '6', value: 6, emoji: '🍽️' },
      { label: '8', value: 8, emoji: '😋' },
      { label: '10', value: 10, emoji: '🎈' }
    ],
    correctAnswer: 8,
    successMessage: 'Muito bem! O dobro de 4 é 8.',
    errorMessage: 'Tente repetir a mesma quantidade duas vezes.',
    explanation: 'Dobro significa somar a quantidade com ela mesma.'
  }),

  question({
    moduleId: 'math',
    day: 5,
    suffix: 'd5-desafio-onibus',
    emoji: '🚌',
    difficulty: 'challenge',
    title: 'Viagem da escola',
    prompt: 'Entraram 7 crianças no ônibus e depois mais 5. Quantas crianças havia?',
    tip: 'Some 7 com 5.',
    options: [
      { label: '11', value: 11, emoji: '🌥️' },
      { label: '12', value: 12, emoji: '🎒' },
      { label: '13', value: 13, emoji: '🛣️' }
    ],
    correctAnswer: 12,
    successMessage: 'Boa! 7 mais 5 é igual a 12.',
    errorMessage: 'Quase. Conte 5 números depois do 7.',
    explanation: 'Problemas do cotidiano também usam soma.'
  }),
  question({
    moduleId: 'math',
    day: 5,
    suffix: 'd5-desafio-menor',
    emoji: '🔍',
    difficulty: 'core',
    title: 'Qual é o menor?',
    prompt: 'Entre 41, 14 e 24, qual é o menor número?',
    tip: 'Compare a primeira dezena de cada número.',
    options: [
      { label: '41', value: 41, emoji: '🟥' },
      { label: '14', value: 14, emoji: '🟩' },
      { label: '24', value: 24, emoji: '🟦' }
    ],
    correctAnswer: 14,
    successMessage: 'Isso! 14 é o menor da lista.',
    errorMessage: 'Olhe quem tem a menor dezena.',
    explanation: 'Para comparar números de dois algarismos, olhamos dezenas e depois unidades.'
  }),
  question({
    moduleId: 'math',
    day: 5,
    suffix: 'd5-ordem-crescente',
    emoji: '📈',
    difficulty: 'warmup',
    title: 'Sequência certa',
    prompt: 'Qual opção está em ordem crescente?',
    tip: 'Comece no menor número.',
    options: [
      { label: '9, 12, 18, 37', value: 'a', emoji: '🟢' },
      { label: '18, 12, 9, 37', value: 'b', emoji: '🟡' },
      { label: '37, 18, 12, 9', value: 'c', emoji: '🔴' }
    ],
    correctAnswer: 'a',
    successMessage: 'Muito bem! A sequência cresce do menor para o maior.',
    errorMessage: 'Observe qual lista começa no menor número.',
    explanation: 'Ordem crescente vai do menor para o maior.'
  }),

  // =========================================================
  // GEOGRAPHY — 5 dias / 3 questões por dia
  // =========================================================
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'd1-lugar-estudo',
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
    successMessage: 'Perfeito! A escola é um lugar de aprendizagem.',
    errorMessage: 'Procure o lugar onde acontecem as aulas.',
    explanation: 'A escola reúne estudantes, professores e materiais de estudo.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'd1-rua-comercial',
    emoji: '🏪',
    difficulty: 'warmup',
    title: 'Rua movimentada',
    prompt: 'Uma rua com muitas lojas e compras é uma rua:',
    tip: 'Observe onde as pessoas compram.',
    options: [
      { label: 'Comercial', value: 'comercial', emoji: '🛍️' },
      { label: 'Rural', value: 'rural', emoji: '🌾' },
      { label: 'Vazia', value: 'vazia', emoji: '🌫️' }
    ],
    correctAnswer: 'comercial',
    successMessage: 'Boa! Ruas com lojas são comerciais.',
    errorMessage: 'Quase. Pense nas ruas de compras.',
    explanation: 'Ruas comerciais concentram lojas e serviços.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'd1-faixa-pedestre',
    emoji: '🚸',
    difficulty: 'core',
    title: 'Travessia segura',
    prompt: 'Onde é mais seguro atravessar a rua?',
    tip: 'Procure o lugar marcado para pedestres.',
    options: [
      { label: 'Na faixa de pedestres', value: 'faixa', emoji: '✅' },
      { label: 'No meio da rua', value: 'meio', emoji: '⚠️' },
      { label: 'Entre carros parados', value: 'carros', emoji: '🚗' }
    ],
    correctAnswer: 'faixa',
    successMessage: 'Isso! A faixa ajuda na travessia segura.',
    errorMessage: 'Escolha o local pensado para pedestres.',
    explanation: 'A faixa organiza a travessia e aumenta a segurança.'
  }),

  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'd2-meio-transporte',
    emoji: '🚲',
    difficulty: 'core',
    title: 'Como chegar?',
    prompt: 'Qual meio de transporte não polui e ainda faz exercício?',
    tip: 'Pense no transporte movido por pedal.',
    options: [
      { label: 'Bicicleta', value: 'bicicleta', emoji: '🌿' },
      { label: 'Moto', value: 'moto', emoji: '🏍️' },
      { label: 'Caminhão', value: 'caminhao', emoji: '🚚' }
    ],
    correctAnswer: 'bicicleta',
    successMessage: 'Boa! A bicicleta é uma escolha sustentável.',
    errorMessage: 'Procure o transporte que usa pedal.',
    explanation: 'Alguns deslocamentos podem ser mais leves para o ambiente.'
  }),
  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'd2-bairro-cuidado',
    emoji: '🏡',
    difficulty: 'warmup',
    title: 'Cuidando do bairro',
    prompt: 'Qual atitude ajuda a manter o bairro bonito?',
    tip: 'Escolha a atitude de cuidado.',
    options: [
      { label: 'Jogar lixo na lixeira', value: 'lixeira', emoji: '🗑️' },
      { label: 'Rasgar plantas da praça', value: 'plantas', emoji: '🌱' },
      { label: 'Pichar a parede da escola', value: 'pichar', emoji: '🎨' }
    ],
    correctAnswer: 'lixeira',
    successMessage: 'Muito bem! Cuidar do lixo ajuda o bairro.',
    errorMessage: 'Pense em uma atitude de cuidado e respeito.',
    explanation: 'Espaços coletivos ficam melhores quando todos colaboram.'
  }),
  question({
    moduleId: 'geography',
    day: 2,
    suffix: 'd2-rua-residencial',
    emoji: '📮',
    difficulty: 'warmup',
    title: 'Achando a casa',
    prompt: 'Para encontrar uma casa na rua, qual informação ajuda mais? 🏠',
    tip: 'Pense no que aparece no endereço.',
    options: [
      { label: 'O número da casa', value: 'numero', emoji: '🔢' },
      { label: 'A cor do céu', value: 'ceu', emoji: '☁️' },
      { label: 'O sabor do lanche', value: 'lanche', emoji: '🍪' }
    ],
    correctAnswer: 'numero',
    successMessage: 'Isso! O número ajuda a localizar a casa. 📍',
    errorMessage: 'Quase. Pense no que faz parte do endereço.',
    explanation: 'O endereço usa informações como nome da rua e número para localizar lugares.'
  }),

  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'd3-direcao-esquerda',
    emoji: '⬅️',
    difficulty: 'core',
    title: 'Virando na esquina',
    prompt: 'Se a seta aponta para a esquerda, para que lado você deve virar?',
    tip: 'Siga a seta.',
    options: [
      { label: 'Esquerda', value: 'esquerda', emoji: '⬅️' },
      { label: 'Direita', value: 'direita', emoji: '➡️' },
      { label: 'Para trás', value: 'tras', emoji: '↩️' }
    ],
    correctAnswer: 'esquerda',
    successMessage: 'Boa! A seta levou você para a esquerda.',
    errorMessage: 'Olhe o lado para onde a seta aponta.',
    explanation: 'Sinais de direção ajudam a orientar percursos.'
  }),
  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'd3-perto-longe',
    emoji: '📍',
    difficulty: 'warmup',
    title: 'Perto ou longe?',
    prompt: 'Se o mercado fica na esquina de casa, ele está:',
    tip: 'Esquina é um lugar próximo.',
    options: [
      { label: 'Perto', value: 'perto', emoji: '😊' },
      { label: 'Longe', value: 'longe', emoji: '🚀' },
      { label: 'Em outro país', value: 'pais', emoji: '🌍' }
    ],
    correctAnswer: 'perto',
    successMessage: 'Isso! A esquina fica pertinho.',
    errorMessage: 'Pense na distância curta da esquina.',
    explanation: 'Palavras de localização ajudam a descrever distâncias.'
  }),
  question({
    moduleId: 'geography',
    day: 3,
    suffix: 'd3-mapa-rotas',
    emoji: '🛤️',
    difficulty: 'challenge',
    title: 'Escolha a rota',
    prompt: 'Para chegar da casa até a escola com segurança, a melhor rota é a que passa:',
    tip: 'Procure a rota com calçada e faixa.',
    options: [
      { label: 'Pela calçada e faixa de pedestres', value: 'segura', emoji: '🟢' },
      { label: 'Pelo meio da avenida', value: 'avenida', emoji: '🔴' },
      { label: 'Entre carros estacionados', value: 'carros', emoji: '🟠' }
    ],
    correctAnswer: 'segura',
    successMessage: 'Muito bem! A rota segura protege pedestres.',
    errorMessage: 'Escolha a rota com espaços pensados para pedestres.',
    explanation: 'Mapear o caminho ajuda a tomar decisões mais seguras.'
  }),

  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'd4-acessibilidade-rampa',
    emoji: '♿',
    difficulty: 'core',
    title: 'Cidade para todos',
    prompt: 'Uma rampa na entrada de um prédio ajuda principalmente:',
    tip: 'Pense em quem precisa de acesso sem degrau.',
    options: [
      {
        label: 'O acesso de todos, inclusive cadeira de rodas e carrinho',
        value: 'rampa',
        emoji: '🤝'
      },
      { label: 'Apenas carros grandes', value: 'carros', emoji: '🚗' },
      { label: 'Somente bicicletas', value: 'bike', emoji: '🚲' }
    ],
    correctAnswer: 'rampa',
    successMessage: 'Perfeito! Rampas melhoram a acessibilidade.',
    errorMessage: 'Quase. Pense em quem precisa entrar sem subir degraus.',
    explanation: 'A acessibilidade deixa os espaços mais inclusivos.'
  }),
  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'd4-paisagem-natural',
    emoji: '🌳',
    difficulty: 'warmup',
    title: 'O que faz parte da natureza?',
    prompt: 'Qual elemento faz parte de uma paisagem natural?',
    tip: 'Pense em algo que nasce na natureza.',
    options: [
      { label: 'Árvore', value: 'arvore', emoji: '🌳' },
      { label: 'Semáforo', value: 'semaforo', emoji: '🚦' },
      { label: 'Escada rolante', value: 'escada', emoji: '🛗' }
    ],
    correctAnswer: 'arvore',
    successMessage: 'Isso! A árvore faz parte da paisagem natural.',
    errorMessage: 'Procure um elemento que não foi construído por pessoas.',
    explanation: 'Paisagens naturais incluem plantas, rios, montanhas e céu.'
  }),
  question({
    moduleId: 'geography',
    day: 4,
    suffix: 'd4-servico-publico',
    emoji: '🚒',
    difficulty: 'challenge',
    title: 'Quem ajuda em emergências?',
    prompt: 'Qual serviço público ajuda a apagar incêndios?',
    tip: 'Pense no time que usa caminhão vermelho.',
    options: [
      { label: 'Bombeiros', value: 'bombeiros', emoji: '🚒' },
      { label: 'Bibliotecários', value: 'biblioteca', emoji: '📚' },
      { label: 'Jardineiros', value: 'jardim', emoji: '🌷' }
    ],
    correctAnswer: 'bombeiros',
    successMessage: 'Boa! Bombeiros ajudam em incêndios e resgates.',
    errorMessage: 'Observe quem atua em emergências com caminhão especial.',
    explanation: 'Serviços públicos mantêm a cidade funcionando e protegida.'
  }),

  question({
    moduleId: 'geography',
    day: 5,
    suffix: 'd5-ponto-referencia',
    emoji: '📌',
    difficulty: 'challenge',
    title: 'Ponto de referência',
    prompt: 'Uma praça grande perto de casa pode ajudar como:',
    tip: 'Pense em algo que ajuda a se orientar.',
    options: [
      { label: 'Ponto de referência', value: 'referencia', emoji: '🧭' },
      { label: 'Brinquedo invisível', value: 'invisivel', emoji: '🎲' },
      { label: 'Nome secreto da rua', value: 'segredo', emoji: '🕵️' }
    ],
    correctAnswer: 'referencia',
    successMessage: 'Muito bem! Pontos de referência ajudam a localizar lugares.',
    errorMessage: 'Quase. Pense no que ajuda a reconhecer o caminho.',
    explanation: 'Pontos marcantes facilitam a orientação pela cidade.'
  }),
  question({
    moduleId: 'geography',
    day: 5,
    suffix: 'd5-transporte-publico',
    emoji: '🚍',
    difficulty: 'core',
    title: 'Viagem coletiva',
    prompt: 'Qual transporte leva muitas pessoas ao mesmo tempo pela cidade?',
    tip: 'Pense no veículo grande com várias poltronas.',
    options: [
      { label: 'Ônibus', value: 'onibus', emoji: '🚍' },
      { label: 'Patins', value: 'patins', emoji: '🛼' },
      { label: 'Patinete de brinquedo', value: 'patinete', emoji: '🛴' }
    ],
    correctAnswer: 'onibus',
    successMessage: 'Isso! O ônibus é um transporte coletivo.',
    errorMessage: 'Escolha o veículo que transporta muita gente.',
    explanation: 'Transportes coletivos ajudam muitas pessoas a se deslocar.'
  }),
  question({
    moduleId: 'geography',
    day: 5,
    suffix: 'd5-mapa-simbolo',
    emoji: '🧭',
    difficulty: 'warmup',
    title: 'Lendo o mapa',
    prompt: 'No mapa, um desenho pequeno que representa um lugar é chamado de:',
    tip: 'Pense no sinal usado para mostrar algo.',
    options: [
      { label: 'Símbolo', value: 'simbolo', emoji: '🗺️' },
      { label: 'Nuvem', value: 'nuvem', emoji: '☁️' },
      { label: 'Janela', value: 'janela', emoji: '🪟' }
    ],
    correctAnswer: 'simbolo',
    successMessage: 'Muito bem! Os mapas usam símbolos.',
    errorMessage: 'Quase. O mapa usa pequenos sinais para representar lugares.',
    explanation: 'Símbolos ajudam a resumir informações no mapa.'
  }),

  // =========================================================
  // SCIENCE — 5 dias / 3 questões por dia
  // =========================================================
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'd1-cientista-laboratorio',
    emoji: '🧪',
    difficulty: 'warmup',
    title: 'Lugar de pesquisa',
    prompt: 'Qual lugar pode ser usado para fazer experiências científicas?',
    tip: 'Pense em um local de observação e testes.',
    options: [
      { label: 'Laboratório', value: 'laboratorio', emoji: '🔬' },
      { label: 'Palco de show', value: 'palco', emoji: '🎤' },
      { label: 'Piscina de bolinhas', value: 'piscina', emoji: '🟠' }
    ],
    correctAnswer: 'laboratorio',
    successMessage: 'Boa! Laboratórios são usados para pesquisar.',
    errorMessage: 'Procure o lugar onde cientistas observam e testam.',
    explanation: 'Nem toda ciência acontece em laboratório, mas ele é um espaço comum de pesquisa.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'd1-ser-vivo',
    emoji: '🌱',
    difficulty: 'warmup',
    title: 'Quem cresce?',
    prompt: 'Qual destas opções é um ser vivo?',
    tip: 'Procure quem nasce, cresce e precisa de cuidados.',
    options: [
      { label: 'Planta', value: 'planta', emoji: '🌱' },
      { label: 'Pedra', value: 'pedra', emoji: '🪨' },
      { label: 'Copo', value: 'copo', emoji: '🥤' }
    ],
    correctAnswer: 'planta',
    successMessage: 'Isso! A planta é um ser vivo.',
    errorMessage: 'Quase. Escolha quem cresce e precisa de água.',
    explanation: 'Seres vivos se desenvolvem e interagem com o ambiente.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'd1-metodo-observar',
    emoji: '👀',
    difficulty: 'core',
    title: 'Primeiro passo',
    prompt: 'Antes de responder uma pergunta científica, o melhor primeiro passo é:',
    tip: 'Comece olhando com atenção.',
    options: [
      { label: 'Observar', value: 'observar', emoji: '👀' },
      { label: 'Inventar sem olhar', value: 'inventar', emoji: '🎭' },
      { label: 'Esconder o material', value: 'esconder', emoji: '🙈' }
    ],
    correctAnswer: 'observar',
    successMessage: 'Muito bem! Observar ajuda a descobrir pistas.',
    errorMessage: 'Pense em como a curiosidade começa.',
    explanation: 'A observação é uma etapa importante da investigação.'
  }),

  question({
    moduleId: 'science',
    day: 2,
    suffix: 'd2-estado-agua',
    emoji: '💧',
    difficulty: 'core',
    title: 'Água no copo',
    prompt: 'A água dentro do copo está em qual estado?',
    tip: 'Pense na água como ela aparece no dia a dia.',
    options: [
      { label: 'Líquido', value: 'liquido', emoji: '💧' },
      { label: 'Sólido', value: 'solido', emoji: '🧊' },
      { label: 'Gasoso', value: 'gasoso', emoji: '☁️' }
    ],
    correctAnswer: 'liquido',
    successMessage: 'Isso! No copo, a água está líquida.',
    errorMessage: 'Observe a forma da água no recipiente.',
    explanation: 'Líquidos se adaptam ao formato do recipiente.'
  }),
  question({
    moduleId: 'science',
    day: 2,
    suffix: 'd2-objeto-imanta',
    emoji: '🧲',
    difficulty: 'challenge',
    title: 'O que o ímã puxa?',
    prompt: 'Qual objeto pode ser puxado por um ímã?',
    tip: 'Pense em metal.',
    options: [
      { label: 'Clipes de metal', value: 'clips', emoji: '📎' },
      { label: 'Algodão', value: 'algodao', emoji: '☁️' },
      { label: 'Papel colorido', value: 'papel', emoji: '📄' }
    ],
    correctAnswer: 'clips',
    successMessage: 'Muito bem! Metais como clipes podem ser atraídos.',
    errorMessage: 'Escolha o objeto metálico.',
    explanation: 'Ímãs atraem alguns metais.'
  }),
  question({
    moduleId: 'science',
    day: 2,
    suffix: 'd2-mistura-separacao',
    emoji: '🥣',
    difficulty: 'core',
    title: 'Separando a mistura',
    prompt: 'Para separar água e areia, o melhor é:',
    tip: 'Pense em deixar a água passar e a areia ficar.',
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
    suffix: 'd3-planta-luz',
    emoji: '☀️',
    difficulty: 'core',
    title: 'Do que a planta precisa?',
    prompt: 'Qual combinação ajuda uma planta a crescer?',
    tip: 'Pense em cuidado diário.',
    options: [
      { label: 'Água, luz e solo', value: 'cuidado', emoji: '🌱' },
      { label: 'Som alto e tinta', value: 'tinta', emoji: '🎨' },
      { label: 'Plástico e poeira', value: 'poeira', emoji: '🧺' }
    ],
    correctAnswer: 'cuidado',
    successMessage: 'Isso! Plantas precisam de água, luz e solo adequado.',
    errorMessage: 'Quase. Escolha a combinação que nutre a planta.',
    explanation: 'Seres vivos precisam de condições favoráveis para viver.'
  }),
  question({
    moduleId: 'science',
    day: 3,
    suffix: 'd3-animal-habitat',
    emoji: '🐠',
    difficulty: 'warmup',
    title: 'Onde vive o peixe?',
    prompt: 'Qual é o habitat mais comum para um peixe?',
    tip: 'Pense no lugar com água.',
    options: [
      { label: 'Rio ou lago', value: 'agua', emoji: '🌊' },
      { label: 'Deserto seco', value: 'deserto', emoji: '🏜️' },
      { label: 'Telhado da casa', value: 'telhado', emoji: '🏠' }
    ],
    correctAnswer: 'agua',
    successMessage: 'Boa! Peixes vivem em ambientes com água.',
    errorMessage: 'Procure o local onde o peixe consegue nadar.',
    explanation: 'Cada ser vivo se adapta melhor a certos ambientes.'
  }),
  question({
    moduleId: 'science',
    day: 3,
    suffix: 'd3-sombra-luz',
    emoji: '🌤️',
    difficulty: 'challenge',
    title: 'Quando aparece sombra?',
    prompt: 'A sombra aparece quando:',
    tip: 'Pense no encontro entre luz e objeto.',
    options: [
      {
        label: 'A luz encontra um objeto e é bloqueada',
        value: 'sombra',
        emoji: '🕶️'
      },
      { label: 'Não existe nenhuma luz', value: 'escuro', emoji: '🌑' },
      { label: 'O objeto some magicamente', value: 'magica', emoji: '🎩' }
    ],
    correctAnswer: 'sombra',
    successMessage: 'Muito bem! A sombra surge quando a luz é bloqueada.',
    errorMessage: 'Quase. Pense em como o corpo faz sombra ao sol.',
    explanation: 'A sombra depende da luz e de um objeto no caminho.'
  }),

  question({
    moduleId: 'science',
    day: 4,
    suffix: 'd4-reciclagem-material',
    emoji: '♻️',
    difficulty: 'core',
    title: 'Qual material é esse?',
    prompt: 'Uma garrafa de vidro pertence principalmente a qual material?',
    tip: 'Olhe para o próprio nome do objeto.',
    options: [
      { label: 'Vidro', value: 'vidro', emoji: '🍾' },
      { label: 'Papel', value: 'papel', emoji: '📄' },
      { label: 'Tecido', value: 'tecido', emoji: '🧵' }
    ],
    correctAnswer: 'vidro',
    successMessage: 'Isso! Garrafa de vidro pertence ao grupo do vidro.',
    errorMessage: 'Escolha o material do qual a garrafa é feita.',
    explanation: 'Reconhecer materiais ajuda no cuidado com o ambiente.'
  }),
  question({
    moduleId: 'science',
    day: 4,
    suffix: 'd4-seguranca-experiencia',
    emoji: '🥽',
    difficulty: 'challenge',
    title: 'Experiência com cuidado',
    prompt: 'Qual atitude é segura durante uma experiência?',
    tip: 'Pense em proteção e atenção.',
    options: [
      { label: 'Seguir orientações e usar proteção', value: 'segura', emoji: '🥽' },
      { label: 'Misturar tudo sem perguntar', value: 'misturar', emoji: '💥' },
      { label: 'Correr pelo laboratório', value: 'correr', emoji: '🏃' }
    ],
    correctAnswer: 'segura',
    successMessage: 'Muito bem! Ciência também precisa de cuidado.',
    errorMessage: 'Procure a atitude mais responsável.',
    explanation: 'Segurança é parte da aprendizagem científica.'
  }),
  question({
    moduleId: 'science',
    day: 4,
    suffix: 'd4-tempo-evaporacao',
    emoji: '☀️',
    difficulty: 'core',
    title: 'Roupa secando',
    prompt: 'Por que a roupa molhada seca no varal?',
    tip: 'A água vai saindo aos poucos.',
    options: [
      { label: 'Porque a água evapora', value: 'evapora', emoji: '💨' },
      { label: 'Porque a roupa encolhe e some', value: 'encolhe', emoji: '🪄' },
      { label: 'Porque o tecido bebe a água para sempre', value: 'bebe', emoji: '🧃' }
    ],
    correctAnswer: 'evapora',
    successMessage: 'Boa! A água evapora e a roupa seca.',
    errorMessage: 'Pense no que acontece com a água ao sol e ao vento.',
    explanation: 'Evaporação é quando o líquido passa aos poucos para o ar.'
  }),

  question({
    moduleId: 'science',
    day: 5,
    suffix: 'd5-desafio-solido',
    emoji: '🔥',
    difficulty: 'challenge',
    title: 'Gelo derretendo',
    prompt: 'Quando o gelo fica fora da geladeira por um tempo, ele vira: 🧊➡️',
    tip: 'Pense no que acontece quando o gelo esquenta.',
    options: [
      { label: 'Água líquida', value: 'liquida', emoji: '💧' },
      { label: 'Fumaça azul', value: 'fumaca', emoji: '🌫️' },
      { label: 'Pedra gelada', value: 'pedra', emoji: '🪨' }
    ],
    correctAnswer: 'liquida',
    successMessage: 'Muito bem! O gelo derrete e vira água líquida. 💧',
    errorMessage: 'Quase. Pense no que aparece no copo quando o gelo derrete.',
    explanation: 'Derreter é a mudança do estado sólido para o líquido.'
  }),
  question({
    moduleId: 'science',
    day: 5,
    suffix: 'd5-desafio-ciclo',
    emoji: '🔄',
    difficulty: 'challenge',
    title: 'Ciência em movimento',
    prompt: 'Qual atitude combina com um pequeno cientista?',
    tip: 'Pense em curiosidade e cuidado.',
    options: [
      { label: 'Observar, perguntar e testar com segurança', value: 'cientista', emoji: '🧠' },
      { label: 'Ignorar o que vê', value: 'ignorar', emoji: '🙈' },
      { label: 'Responder sem pensar', value: 'sem-pensar', emoji: '⚡' }
    ],
    correctAnswer: 'cientista',
    successMessage: 'Perfeito! Esse é o jeito curioso de aprender.',
    errorMessage: 'Escolha a atitude mais investigativa.',
    explanation: 'Curiosidade e cuidado andam juntos na ciência.'
  }),
  question({
    moduleId: 'science',
    day: 5,
    suffix: 'd5-sentido-escuta',
    emoji: '👂',
    difficulty: 'warmup',
    title: 'Qual sentido usamos?',
    prompt: 'Para ouvir o canto de um pássaro usamos:',
    tip: 'Pense no sentido da audição.',
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

  // =========================================================
  // LANGUAGE — 5 dias / 3 questões por dia
  // =========================================================
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'd1-silabas-coelho',
    emoji: '🐰',
    difficulty: 'warmup',
    title: 'Separando a palavra',
    prompt: 'Qual é a separação correta da palavra "coelho"?',
    tip: 'Bata palmas para cada pedacinho.',
    options: [
      { label: 'co-e-lho', value: 'b', emoji: '👏' },
      { label: 'coe-lho', value: 'a', emoji: '🎈' },
      { label: 'coel-ho', value: 'c', emoji: '🧩' }
    ],
    correctAnswer: 'b',
    successMessage: 'Muito bem! co-e-lho é a divisão correta.',
    errorMessage: 'Quase. Tente ouvir os pedacinhos da palavra.',
    explanation: 'Separar sílabas ajuda a perceber os sons da palavra.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'd1-silabas-casa',
    emoji: '🔚',
    difficulty: 'warmup',
    title: 'Última letra',
    prompt: 'Qual é a última letra da palavra "casa"? 🏠',
    tip: 'Olhe para o final da palavra.',
    options: [
      { label: 'C', value: 'c', emoji: '1️⃣' },
      { label: 'S', value: 's', emoji: '2️⃣' },
      { label: 'A', value: 'a', emoji: '3️⃣' }
    ],
    correctAnswer: 'a',
    successMessage: 'Boa! A palavra "casa" termina com A. ✨',
    errorMessage: 'Quase. Observe a letrinha do final.',
    explanation: 'Perceber a posição das letras ajuda na leitura e na escrita.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'd1-letra-inicial',
    emoji: '🔤',
    difficulty: 'core',
    title: 'Som inicial',
    prompt: 'Com qual letra começa a palavra "bola"?',
    tip: 'Ouça o primeiro som.',
    options: [
      { label: 'B', value: 'b', emoji: '🅱️' },
      { label: 'P', value: 'p', emoji: '🅿️' },
      { label: 'L', value: 'l', emoji: '🅻' }
    ],
    correctAnswer: 'b',
    successMessage: 'Isso! bola começa com B.',
    errorMessage: 'Quase. Escute o primeiro som da palavra.',
    explanation: 'A letra inicial ajuda a identificar palavras.'
  }),

  question({
    moduleId: 'language',
    day: 2,
    suffix: 'd2-rima-gato',
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
    suffix: 'd2-som-meio',
    emoji: '🔎',
    difficulty: 'warmup',
    title: 'Letra do meio',
    prompt: 'Qual letra aparece no meio da palavra "sol"?',
    tip: 'Observe as três letras em ordem.',
    options: [
      { label: 'S', value: 's', emoji: '1️⃣' },
      { label: 'O', value: 'o', emoji: '2️⃣' },
      { label: 'L', value: 'l', emoji: '3️⃣' }
    ],
    correctAnswer: 'o',
    successMessage: 'Isso! O fica no meio de s-o-l.',
    errorMessage: 'Olhe a letra que está entre as duas outras.',
    explanation: 'Perceber a posição das letras ajuda na leitura.'
  }),
  question({
    moduleId: 'language',
    day: 2,
    suffix: 'd2-palavra-correta',
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
    explanation: 'Frases com sentido mostram a função real das palavras.'
  }),

  question({
    moduleId: 'language',
    day: 3,
    suffix: 'd3-pontuacao-pergunta',
    emoji: '❓',
    difficulty: 'core',
    title: 'Sinal certo',
    prompt: 'Qual sinal usamos no final de uma pergunta?',
    tip: 'Pense em quando queremos saber algo.',
    options: [
      { label: '?', value: '?', emoji: '❓' },
      { label: '!', value: '!', emoji: '❗' },
      { label: '.', value: '.', emoji: '⚪' }
    ],
    correctAnswer: '?',
    successMessage: 'Boa! Perguntas terminam com ponto de interrogação.',
    errorMessage: 'Qual sinal aparece quando perguntamos algo?',
    explanation: 'A pontuação ajuda a entender a intenção da frase.'
  }),
  question({
    moduleId: 'language',
    day: 3,
    suffix: 'd3-ordem-frase',
    emoji: '🧩',
    difficulty: 'challenge',
    title: 'Organizando a frase',
    prompt: 'Qual ordem monta uma frase correta?',
    tip: 'Comece por quem faz a ação.',
    options: [
      { label: 'A menina leu o livro.', value: 'certa', emoji: '📚' },
      { label: 'Livro a leu menina o.', value: 'errada1', emoji: '🔀' },
      { label: 'Leu o a livro menina.', value: 'errada2', emoji: '🌀' }
    ],
    correctAnswer: 'certa',
    successMessage: 'Muito bem! Essa frase está organizada.',
    errorMessage: 'Observe qual frase está na ordem natural da leitura.',
    explanation: 'A ordem das palavras ajuda a dar sentido.'
  }),
  question({
    moduleId: 'language',
    day: 3,
    suffix: 'd3-palavra-oposta',
    emoji: '↔️',
    difficulty: 'core',
    title: 'Palavra contrária',
    prompt: 'Qual é a palavra oposta de "grande"?',
    tip: 'Pense no contrário.',
    options: [
      { label: 'Pequeno', value: 'pequeno', emoji: '🪁' },
      { label: 'Pesado', value: 'pesado', emoji: '🏋️' },
      { label: 'Redondo', value: 'redondo', emoji: '⚽' }
    ],
    correctAnswer: 'pequeno',
    successMessage: 'Isso! Pequeno é o contrário de grande.',
    errorMessage: 'Procure a palavra de sentido oposto.',
    explanation: 'Relacionar palavras ajuda na compreensão.'
  }),

  question({
    moduleId: 'language',
    day: 4,
    suffix: 'd4-plural-flor',
    emoji: '🌸',
    difficulty: 'core',
    title: 'Uma ou muitas?',
    prompt: 'Qual é o plural de "flor"?',
    tip: 'Pense em várias flores juntas.',
    options: [
      { label: 'Flores', value: 'flores', emoji: '🌸' },
      { label: 'Floras', value: 'floras', emoji: '🌺' },
      { label: 'Floris', value: 'floris', emoji: '🌼' }
    ],
    correctAnswer: 'flores',
    successMessage: 'Boa! O plural correto é flores.',
    errorMessage: 'Procure a forma usada para muitas flores.',
    explanation: 'O plural muda a palavra para indicar quantidade maior que um.'
  }),
  question({
    moduleId: 'language',
    day: 4,
    suffix: 'd4-leitura-bilhete',
    emoji: '💌',
    difficulty: 'challenge',
    title: 'Entendendo o bilhete',
    prompt: 'Se o bilhete diz "Leve o caderno amanhã", o que você precisa fazer?',
    tip: 'Procure a ação pedida no bilhete.',
    options: [
      { label: 'Levar o caderno no dia seguinte', value: 'caderno', emoji: '📒' },
      { label: 'Guardar o caderno para sempre', value: 'guardar', emoji: '🧺' },
      { label: 'Emprestar o caderno ao cachorro', value: 'cachorro', emoji: '🐶' }
    ],
    correctAnswer: 'caderno',
    successMessage: 'Perfeito! O bilhete pede para levar o caderno amanhã.',
    errorMessage: 'Leia novamente o pedido do bilhete.',
    explanation: 'Ler e entender instruções é parte da rotina escolar.'
  }),
  question({
    moduleId: 'language',
    day: 4,
    suffix: 'd4-emoji-sentimento',
    emoji: '😊',
    difficulty: 'warmup',
    title: 'Como a frase soa?',
    prompt: 'A frase "Consegui!" combina mais com qual sentimento?',
    tip: 'Pense em algo alegre.',
    options: [
      { label: 'Felicidade', value: 'felicidade', emoji: '😊' },
      { label: 'Sono', value: 'sono', emoji: '😴' },
      { label: 'Frio', value: 'frio', emoji: '🥶' }
    ],
    correctAnswer: 'felicidade',
    successMessage: 'Isso! A frase mostra alegria pela conquista.',
    errorMessage: 'Qual sentimento combina com uma conquista?',
    explanation: 'As palavras também transmitem emoção.'
  }),

  question({
    moduleId: 'language',
    day: 5,
    suffix: 'd5-desafio-recado',
    emoji: '🗣️',
    difficulty: 'challenge',
    title: 'Quem está falando?',
    prompt: 'Na frase "Eu adoro brincar no parque!", quem está falando? 😊',
    tip: 'Pense em quem diz a palavra "eu".',
    options: [
      { label: 'A própria pessoa que fala', value: 'eu', emoji: '🙋' },
      { label: 'O parque', value: 'parque', emoji: '🌳' },
      { label: 'A bola', value: 'bola', emoji: '⚽' }
    ],
    correctAnswer: 'eu',
    successMessage: 'Isso! "Eu" mostra quem está falando. 🎉',
    errorMessage: 'Quase. A palavra "eu" fala da própria pessoa.',
    explanation: 'Na fala e na escrita, "eu" indica quem está se expressando.'
  }),
  question({
    moduleId: 'language',
    day: 5,
    suffix: 'd5-desafio-recado',
    emoji: '📣',
    difficulty: 'challenge',
    title: 'Lendo o recado',
    prompt: 'Um recado diz: "Não esquecer a garrafinha". O que deve ser levado?',
    tip: 'Leia o objeto citado no recado.',
    options: [
      { label: 'A garrafinha', value: 'garrafinha', emoji: '🧴' },
      { label: 'Um travesseiro', value: 'travesseiro', emoji: '🛏️' },
      { label: 'Um guarda-chuva', value: 'guarda-chuva', emoji: '☂️' }
    ],
    correctAnswer: 'garrafinha',
    successMessage: 'Muito bem! O recado fala da garrafinha.',
    errorMessage: 'Procure o objeto citado no recado.',
    explanation: 'Ler recados ajuda a seguir combinados e instruções.'
  }),
  question({
    moduleId: 'language',
    day: 5,
    suffix: 'd5-imagem-quintal',
    emoji: '🌿',
    difficulty: 'warmup',
    title: 'Palavra com significado',
    prompt: 'O que significa "quintal"?',
    tip: 'Pense em um espaço da casa.',
    options: [
      { label: 'Parte de trás ou ao redor da casa', value: 'quintal', emoji: '🏡' },
      { label: 'Um brinquedo com rodas', value: 'brinquedo', emoji: '🛴' },
      { label: 'Uma roupa de frio', value: 'casaco', emoji: '🧥' }
    ],
    correctAnswer: 'quintal',
    successMessage: 'Muito bem! Quintal é um espaço da casa.',
    errorMessage: 'Procure a opção ligada à casa.',
    explanation: 'Conhecer significados amplia a leitura e a fala.'
  }),
  question({
    moduleId: 'math',
    day: 1,
    suffix: 'd1-contagem-estrelas',
    emoji: '⭐',
    difficulty: 'warmup',
    title: 'Estrelas no painel',
    prompt: 'O painel mostra 5 estrelas e ganha mais 2. Quantas estrelas aparecem agora?',
    tip: 'Some 5 + 2.',
    options: [
      { label: '6', value: 6, emoji: '☁️' },
      { label: '7', value: 7, emoji: '🌟' },
      { label: '8', value: 8, emoji: '🚀' }
    ],
    correctAnswer: 7,
    successMessage: 'Boa! 5 mais 2 e igual a 7.',
    errorMessage: 'Conte mais duas estrelas depois do 5.',
    explanation: 'Somar pequenas quantidades ajuda a ganhar rapidez na contagem.'
  }),
  question({
    moduleId: 'geography',
    day: 1,
    suffix: 'd1-caminho-casa',
    emoji: '🏡',
    difficulty: 'warmup',
    title: 'Lugar de morar',
    prompt: 'Qual lugar usamos para morar e descansar com a familia?',
    tip: 'Pense no lugar onde voce dorme.',
    options: [
      { label: 'Casa', value: 'casa', emoji: '🏠' },
      { label: 'Hospital', value: 'hospital', emoji: '🏥' },
      { label: 'Praia', value: 'praia', emoji: '🏖️' }
    ],
    correctAnswer: 'casa',
    successMessage: 'Isso! A casa e um lugar de moradia.',
    errorMessage: 'Procure o lugar onde a familia mora.',
    explanation: 'A geografia do dia a dia comeca pelos lugares que usamos com frequencia.'
  }),
  question({
    moduleId: 'science',
    day: 1,
    suffix: 'd1-cuidado-agua',
    emoji: '💧',
    difficulty: 'warmup',
    title: 'Usando agua',
    prompt: 'Qual atitude ajuda a economizar agua em casa?',
    tip: 'Pense em evitar desperdicio.',
    options: [
      { label: 'Fechar a torneira ao escovar os dentes', value: 'fechar', emoji: '✅' },
      { label: 'Deixar a agua correr sem usar', value: 'desperdicio', emoji: '❌' },
      { label: 'Molhar a calcada por muito tempo', value: 'calcada', emoji: '🌊' }
    ],
    correctAnswer: 'fechar',
    successMessage: 'Muito bem! Fechar a torneira evita desperdicio.',
    errorMessage: 'Pense em uma atitude que use so a agua necessaria.',
    explanation: 'Cuidar da agua e uma atitude cientifica e responsavel.'
  }),
  question({
    moduleId: 'language',
    day: 1,
    suffix: 'd1-rima-gato',
    emoji: '🐱',
    difficulty: 'warmup',
    title: 'Palavra que rima',
    prompt: 'Qual palavra rima com "gato"?',
    tip: 'Ouça o final da palavra.',
    options: [
      { label: 'Pato', value: 'pato', emoji: '🦆' },
      { label: 'Casa', value: 'casa', emoji: '🏠' },
      { label: 'Livro', value: 'livro', emoji: '📚' }
    ],
    correctAnswer: 'pato',
    successMessage: 'Boa! Gato e pato terminam com som parecido.',
    errorMessage: 'Tente encontrar a palavra com o final mais parecido.',
    explanation: 'Perceber rimas ajuda a notar os sons das palavras.'
  })
]
