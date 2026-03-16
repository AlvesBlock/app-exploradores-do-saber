import type { RunnerObstacleConfig } from '@/types/runner-game'

export const RUNNER_OBSTACLES: RunnerObstacleConfig[] = [
  {
    id: 'cone_barrier',
    name: 'Barreira de Obra',
    emoji: '🚧',
    severity: 'major',
    spawnWeight: 3,
    scorePenalty: 28,
    feedbackText: 'Barreira pesada: erro grande de leitura da pista.'
  },
  {
    id: 'delivery_box',
    name: 'Caixa Caida',
    emoji: '📦',
    severity: 'minor',
    spawnWeight: 4,
    scorePenalty: 18,
    feedbackText: 'Obstaculo leve, mas ainda quebra seu ritmo.'
  },
  {
    id: 'road_hole',
    name: 'Buraco na Via',
    emoji: '🕳️',
    severity: 'major',
    spawnWeight: 2,
    scorePenalty: 30,
    feedbackText: 'Buraco profundo: puniu o posicionamento.'
  },
  {
    id: 'slime_trail',
    name: 'Trilha Escorregadia',
    emoji: '🐌',
    severity: 'minor',
    spawnWeight: 3,
    scorePenalty: 16,
    feedbackText: 'Trecho escorregadio: a lane nao estava limpa.'
  },
  {
    id: 'stop_sign',
    name: 'Sinal Bloqueado',
    emoji: '🛑',
    severity: 'major',
    spawnWeight: 3,
    scorePenalty: 26,
    feedbackText: 'Sinal de bloqueio exige desvio rapido.'
  }
]

export function getRunnerObstacleById(id: string): RunnerObstacleConfig | undefined {
  return RUNNER_OBSTACLES.find((item) => item.id === id)
}
