import type { GameModule, ModulePhase } from '@/types/module'

export const gameModules: GameModule[] = [
  {
    id: 'math',
    title: 'Vila dos Números',
    emoji: '🔢',
    description: 'Sequências, antecessor, sucessor, ordem crescente e calendário.',
    totalPhases: 3,
    color: '#6C63FF'
  },
  {
    id: 'geography',
    title: 'Estrada do Tempo',
    emoji: '🛣️',
    description: 'Ruas, trânsito, cidade, acessibilidade e segurança.',
    totalPhases: 3,
    color: '#FFB84D'
  },
  {
    id: 'science',
    title: 'Ilha da Ciência',
    emoji: '🔬',
    description: 'Cientistas, descobertas, método científico e observação.',
    totalPhases: 3,
    color: '#33C27F'
  },
  {
    id: 'language',
    title: 'Bosque das Palavras',
    emoji: '📚',
    description: 'Sílabas, significado, frases e brincadeiras com palavras.',
    totalPhases: 3,
    color: '#FF7AA2'
  }
]


export const modulePhases: ModulePhase[] = [
  {
    id: 'math-phase-1',
    moduleId: 'math',
    order: 1,
    title: 'Fase 1 — O vizinho do número',
    question: {
      id: 'math-q1',
      type: 'multiple-choice',
      title: 'Encontre o antecessor',
      prompt: 'Quem vem antes do número 21?',
      options: [
        { label: '19', value: 19 },
        { label: '20', value: 20 },
        { label: '22', value: 22 }
      ],
      correctAnswer: 20,
      successMessage: 'Boa! O antecessor de 21 é 20. Você ganhou 1 estrela!',
      errorMessage: 'Quase! Tente contar um número antes de 21.',
      rewardStars: 1
    }
  },
  {
    id: 'math-phase-2',
    moduleId: 'math',
    order: 2,
    title: 'Fase 2 — O próximo número',
    question: {
      id: 'math-q2',
      type: 'multiple-choice',
      title: 'Encontre o sucessor',
      prompt: 'Quem vem depois do número 34?',
      options: [
        { label: '35', value: 35 },
        { label: '33', value: 33 },
        { label: '36', value: 36 }
      ],
      correctAnswer: 35,
      successMessage: 'Muito bem! O sucessor de 34 é 35.',
      errorMessage: 'Ops! Pense no número que vem logo depois de 34.',
      rewardStars: 1
    }
  },
  {
    id: 'math-phase-3',
    moduleId: 'math',
    order: 3,
    title: 'Fase 3 — Ordem crescente',
    question: {
      id: 'math-q3',
      type: 'multiple-choice',
      title: 'Qual sequência está certa?',
      prompt: 'Qual destas opções está em ordem crescente?',
      options: [
        { label: '9, 12, 18, 37', value: 'a' },
        { label: '18, 12, 9, 37', value: 'b' },
        { label: '37, 18, 12, 9', value: 'c' }
      ],
      correctAnswer: 'a',
      successMessage: 'Perfeito! Essa sequência está do menor para o maior.',
      errorMessage: 'Tente outra vez. Ordem crescente é do menor para o maior.',
      rewardStars: 2
    }
  },
  {
    id: 'geography-phase-1',
    moduleId: 'geography',
    order: 1,
    title: 'Fase 1 — Tipo de calçamento',
    question: {
      id: 'geography-q1',
      type: 'multiple-choice',
      title: 'Que tipo de rua é essa?',
      prompt: 'Uma rua coberta de pedras encaixadas é chamada de:',
      options: [
        { label: 'Rua de terra', value: 'terra' },
        { label: 'Paralelepípedo', value: 'paralelepipedo' },
        { label: 'Rua asfaltada', value: 'asfalto' }
      ],
      correctAnswer: 'paralelepipedo',
      successMessage: 'Muito bem! Essa rua é de paralelepípedo.',
      errorMessage: 'Quase! Pense na rua feita com várias pedrinhas encaixadas.',
      rewardStars: 1
    }
  },
  {
    id: 'geography-phase-2',
    moduleId: 'geography',
    order: 2,
    title: 'Fase 2 — Tipo de rua',
    question: {
      id: 'geography-q2',
      type: 'multiple-choice',
      title: 'Qual é o tipo da rua?',
      prompt: 'Uma rua com muitas lojas e movimento de compras é uma rua:',
      options: [
        { label: 'Residencial', value: 'residencial' },
        { label: 'Comercial', value: 'comercial' },
        { label: 'Rural', value: 'rural' }
      ],
      correctAnswer: 'comercial',
      successMessage: 'Isso mesmo! Uma rua com muitas lojas é comercial.',
      errorMessage: 'Tente outra vez. Pense em onde as pessoas vão para comprar.',
      rewardStars: 1
    }
  },
  {
    id: 'geography-phase-3',
    moduleId: 'geography',
    order: 3,
    title: 'Fase 3 — Trânsito seguro',
    question: {
      id: 'geography-q3',
      type: 'multiple-choice',
      title: 'Qual atitude é segura no trânsito?',
      prompt: 'Escolha a atitude correta:',
      options: [
        { label: 'Atravessar fora da faixa', value: 'fora-faixa' },
        { label: 'Usar o cinto de segurança', value: 'cinto' },
        { label: 'Brincar no meio da rua', value: 'brincar-rua' }
      ],
      correctAnswer: 'cinto',
      successMessage: 'Parabéns! Usar o cinto de segurança é uma atitude correta.',
      errorMessage: 'Ops! Pense na atitude que protege você no trânsito.',
      rewardStars: 2
    }
  }

  ,
{
  id: 'science-phase-1',
  moduleId: 'science',
  order: 1,
  title: 'Fase 1 — Lugar de pesquisa',
  question: {
    id: 'science-q1',
    type: 'multiple-choice',
    title: 'Onde o cientista pode pesquisar?',
    prompt: 'Qual destes lugares pode ser um local de pesquisa científica?',
    options: [
      { label: 'Laboratório', value: 'laboratorio' },
      { label: 'Parquinho', value: 'parquinho' },
      { label: 'Palco de show', value: 'palco' }
    ],
    correctAnswer: 'laboratorio',
    successMessage: 'Isso mesmo! Muitos cientistas trabalham em laboratórios.',
    errorMessage: 'Quase! Pense em um lugar com experimentos e descobertas.',
    rewardStars: 1
  }
},
{
  id: 'science-phase-2',
  moduleId: 'science',
  order: 2,
  title: 'Fase 2 — Caminho da descoberta',
  question: {
    id: 'science-q2',
    type: 'multiple-choice',
    title: 'Qual etapa vem primeiro?',
    prompt: 'No método científico, qual ação costuma vir primeiro?',
    options: [
      { label: 'Observar', value: 'observar' },
      { label: 'Concluir', value: 'concluir' },
      { label: 'Guardar o material', value: 'guardar' }
    ],
    correctAnswer: 'observar',
    successMessage: 'Muito bem! Observar é um passo importante para começar uma descoberta.',
    errorMessage: 'Tente outra vez. Antes de descobrir algo, primeiro observamos.',
    rewardStars: 1
  }
},
{
  id: 'science-phase-3',
  moduleId: 'science',
  order: 3,
  title: 'Fase 3 — Aprender com os outros',
  question: {
    id: 'science-q3',
    type: 'multiple-choice',
    title: 'Como podemos aprender?',
    prompt: 'Qual destas é uma forma importante de aprender com os mais experientes?',
    options: [
      { label: 'Observar e ouvir', value: 'observar-ouvir' },
      { label: 'Ignorar explicações', value: 'ignorar' },
      { label: 'Sair correndo', value: 'correndo' }
    ],
    correctAnswer: 'observar-ouvir',
    successMessage: 'Perfeito! Aprendemos muito observando e ouvindo pessoas experientes.',
    errorMessage: 'Pense em como aprendemos com adultos, professores e pessoas mais velhas.',
    rewardStars: 2
  }
}

,
{
  id: 'language-phase-1',
  moduleId: 'language',
  order: 1,
  title: 'Fase 1 — Separando sílabas',
  question: {
    id: 'language-q1',
    type: 'multiple-choice',
    title: 'Como separamos a palavra?',
    prompt: 'Qual é a separação correta da palavra "coelho"?',
    options: [
      { label: 'coe-lho', value: 'a' },
      { label: 'co-e-lho', value: 'b' },
      { label: 'coel-ho', value: 'c' }
    ],
    correctAnswer: 'b',
    successMessage: 'Muito bem! "Coelho" pode ser separado como co-e-lho.',
    errorMessage: 'Quase! Tente bater palminhas para cada pedacinho da palavra.',
    rewardStars: 1
  }
},
{
  id: 'language-phase-2',
  moduleId: 'language',
  order: 2,
  title: 'Fase 2 — Significado da palavra',
  question: {
    id: 'language-q2',
    type: 'multiple-choice',
    title: 'O que é quintal?',
    prompt: 'Qual opção explica melhor a palavra "quintal"?',
    options: [
      { label: 'Parte de trás ou ao redor da casa', value: 'quintal' },
      { label: 'Um animal que pula', value: 'animal' },
      { label: 'Um lugar para cozinhar', value: 'cozinha' }
    ],
    correctAnswer: 'quintal',
    successMessage: 'Isso mesmo! Quintal é um espaço da casa, geralmente ao fundo ou ao redor.',
    errorMessage: 'Pense em uma parte da casa onde dá para brincar ou plantar.',
    rewardStars: 1
  }
},
{
  id: 'language-phase-3',
  moduleId: 'language',
  order: 3,
  title: 'Fase 3 — Montando sentido',
  question: {
    id: 'language-q3',
    type: 'multiple-choice',
    title: 'Qual frase faz sentido?',
    prompt: 'Escolha a frase correta com a palavra "coelho":',
    options: [
      { label: 'O coelho correu no quintal.', value: 'certa' },
      { label: 'O quintal comeu a cenoura.', value: 'errada1' },
      { label: 'A cozinha pulou a janela.', value: 'errada2' }
    ],
    correctAnswer: 'certa',
    successMessage: 'Perfeito! Essa frase faz sentido e usa a palavra corretamente.',
    errorMessage: 'Tente outra vez. Pense em uma frase que combine com um coelho de verdade.',
    rewardStars: 2
  }
}
]