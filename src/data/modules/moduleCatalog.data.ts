import type { GameModule } from '@/types/module'

export const gameModules: GameModule[] = [
  {
    id: 'math',
    title: 'Vila dos Numeros',
    emoji: '🔢',
    mascotEmoji: '🧠',
    description: 'Contagem, sequencias, calendario, comparacao e problemas do dia a dia.',
    worldLabel: 'Mundo da Matematica',
    rewardLabel: 'Medalha dos Numeros Brilhantes',
    totalDays: 5,
    sessionQuestionCount: 4,
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)',
    learningMoments: [
      'Descobrir vizinhos dos numeros',
      'Resolver pequenas pistas de quantidade',
      'Treinar raciocinio com desafios divertidos'
    ]
  },
  {
    id: 'geography',
    title: 'Estrada do Tempo',
    emoji: '🗺️',
    mascotEmoji: '🧭',
    description: 'Cidade, bairros, mapas, transito seguro e caminhos do cotidiano.',
    worldLabel: 'Mundo da Geografia',
    rewardLabel: 'Medalha do Mapa Esperto',
    totalDays: 5,
    sessionQuestionCount: 4,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    learningMoments: [
      'Ler pistas da cidade com clareza',
      'Identificar lugares e trajetos seguros',
      'Usar mapas simples para se orientar'
    ]
  },
  {
    id: 'science',
    title: 'Ilha da Ciencia',
    emoji: '🔬',
    mascotEmoji: '⚗️',
    description: 'Observacao, natureza, materiais, sentidos e descobertas curiosas.',
    worldLabel: 'Mundo da Ciencia',
    rewardLabel: 'Medalha dos Pequenos Cientistas',
    totalDays: 5,
    sessionQuestionCount: 4,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    learningMoments: [
      'Observar antes de responder',
      'Entender o que muda e o que permanece',
      'Relacionar ciencia com o dia a dia'
    ]
  },
  {
    id: 'language',
    title: 'Bosque das Palavras',
    emoji: '📚',
    mascotEmoji: '📝',
    description: 'Silabas, rimas, frases, sentido e leitura com apoio visual.',
    worldLabel: 'Mundo da Linguagem',
    rewardLabel: 'Medalha da Leitura Encantada',
    totalDays: 5,
    sessionQuestionCount: 4,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    learningMoments: [
      'Perceber pedacos sonoros das palavras',
      'Ligar imagem, palavra e significado',
      'Construir frases com sentido'
    ]
  }
]

