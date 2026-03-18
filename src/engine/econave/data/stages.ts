import type { EcoNaveStageConfig, EcoNaveStageId } from '@/types/econave'

export const ECONAVE_STAGE_ORDER: EcoNaveStageId[] = [
  'earth_orbit',
  'debris_belt',
  'satellite_corridor',
  'microplastic_storm',
  'junk_boss'
]

export const ECONAVE_STAGES: EcoNaveStageConfig[] = [
  {
    id: 'earth_orbit',
    order: 1,
    title: 'Orbita da Terra',
    badge: 'Missao 1',
    themeName: 'Boas praticas em orbita baixa',
    description: 'Aprenda a coletar reciclaveis e a nao tocar nas estruturas uteis.',
    gradient: 'linear-gradient(180deg, #082f49 0%, #1d4ed8 52%, #38bdf8 100%)',
    accentColor: '#38bdf8',
    skyTop: 0x082f49,
    skyBottom: 0x1d4ed8,
    soundtrack: 'orbital',
    durationSeconds: 52,
    baseScrollSpeed: 0.18,
    missionLines: [
      'Colete residuos reciclaveis pelo casco da nave.',
      'Neutralize objetos toxicos com o pulso eco.',
      'Proteja os primeiros satelites de comunicacao.'
    ],
    goals: {
      collectTarget: 10,
      neutralizeTarget: 6,
      protectTarget: 3,
      ecoScoreTarget: 48
    },
    spawn: {
      entityIntervalMs: [620, 940],
      powerUpIntervalMs: [6500, 9000],
      bonusIntervalMs: [7200, 9600],
      maxEntities: 11,
      categoryWeights: {
        recyclable: 5,
        hazard: 3,
        satellite: 2,
        obstacle: 2
      },
      blueprintIds: [
        'recycle_can',
        'solar_panel_scrap',
        'battery_cluster',
        'relay_satellite',
        'asteroid_chunk'
      ]
    },
    educationalCard: {
      title: 'Espaco tambem precisa de coleta seletiva',
      fact: 'Objetos em orbita podem ficar circulando por anos e ameacar missoes futuras.',
      tip: 'Nem todo item deve ser destruido: partes reutilizaveis precisam ser recuperadas.',
      summary: 'Separar, proteger e agir com criterio reduz o lixo espacial.'
    }
  },
  {
    id: 'debris_belt',
    order: 2,
    title: 'Cinturao de Detritos',
    badge: 'Missao 2',
    themeName: 'Alta densidade de sucata',
    description: 'A orbita fica mais perigosa e exige respostas rapidas aos residuos toxicos.',
    gradient: 'linear-gradient(180deg, #172554 0%, #1e3a8a 48%, #7c3aed 100%)',
    accentColor: '#8b5cf6',
    skyTop: 0x172554,
    skyBottom: 0x312e81,
    soundtrack: 'storm',
    durationSeconds: 56,
    baseScrollSpeed: 0.205,
    missionLines: [
      'Aumente o ritmo de neutralizacao de residuos perigosos.',
      'Use os power-ups para diminuir erros e manter combo.',
      'Mantenha a nave inteira ate o final da rodada.'
    ],
    goals: {
      collectTarget: 12,
      neutralizeTarget: 10,
      protectTarget: 4,
      ecoScoreTarget: 62
    },
    spawn: {
      entityIntervalMs: [560, 850],
      powerUpIntervalMs: [6200, 8600],
      bonusIntervalMs: [7000, 9200],
      maxEntities: 12,
      categoryWeights: {
        recyclable: 4,
        hazard: 5,
        satellite: 2,
        obstacle: 3
      },
      blueprintIds: [
        'recycle_can',
        'battery_cluster',
        'toxic_cloud',
        'relay_satellite',
        'asteroid_chunk',
        'ice_comet'
      ]
    },
    educationalCard: {
      title: 'Quanto menor o residuo, maior o desafio',
      fact: 'Pequenos fragmentos se movem em alta velocidade e podem perfurar paineis e janelas.',
      tip: 'Neutralize o que e toxico, mas siga coletando o que pode ser reutilizado.',
      summary: 'Responsabilidade ambiental exige rapidez com criterio.'
    }
  },
  {
    id: 'satellite_corridor',
    order: 3,
    title: 'Corredor dos Satelites',
    badge: 'Missao 3',
    themeName: 'Protecao de infraestrutura util',
    description: 'O trafego orbital aumenta. Preservar satelites vira parte central da missao.',
    gradient: 'linear-gradient(180deg, #0f172a 0%, #1f2937 44%, #0f766e 100%)',
    accentColor: '#14b8a6',
    skyTop: 0x0f172a,
    skyBottom: 0x115e59,
    soundtrack: 'orbital',
    durationSeconds: 60,
    baseScrollSpeed: 0.22,
    missionLines: [
      'Escolha alvos com clareza para nao acertar satelites.',
      'Use camera de classificacao quando o corredor apertar.',
      'Concluir com satelites salvos vale mais do que destruir tudo.'
    ],
    goals: {
      collectTarget: 14,
      neutralizeTarget: 12,
      protectTarget: 6,
      ecoScoreTarget: 76
    },
    spawn: {
      entityIntervalMs: [520, 790],
      powerUpIntervalMs: [5600, 8200],
      bonusIntervalMs: [6600, 9000],
      maxEntities: 13,
      categoryWeights: {
        recyclable: 4,
        hazard: 4,
        satellite: 4,
        obstacle: 2
      },
      blueprintIds: [
        'recycle_can',
        'solar_panel_scrap',
        'battery_cluster',
        'toxic_cloud',
        'relay_satellite',
        'solar_station',
        'asteroid_chunk'
      ]
    },
    educationalCard: {
      title: 'Proteger tecnologia util tambem e sustentabilidade',
      fact: 'Satelites ajudam em comunicacao, clima, navegacao e pesquisa cientifica.',
      tip: 'Preservar o que funciona evita desperdicio de materiais e energia.',
      summary: 'Sustentabilidade inclui manutencao e cuidado com infraestrutura.'
    }
  },
  {
    id: 'microplastic_storm',
    order: 4,
    title: 'Tempestade de Microplasticos',
    badge: 'Missao 4',
    themeName: 'Poluicao difusa e decisao rapida',
    description: 'Particulas leves se espalham pela tela e testam precisao e gerenciamento de risco.',
    gradient: 'linear-gradient(180deg, #312e81 0%, #4c1d95 38%, #0f766e 100%)',
    accentColor: '#ec4899',
    skyTop: 0x312e81,
    skyBottom: 0x134e4a,
    soundtrack: 'storm',
    durationSeconds: 64,
    baseScrollSpeed: 0.228,
    missionLines: [
      'Microplasticos devem ser neutralizados antes de se espalharem.',
      'Colete bonus educativos para elevar seu ecoScore.',
      'Power-ups temporais ajudam a ler o caos da fase.'
    ],
    goals: {
      collectTarget: 16,
      neutralizeTarget: 14,
      protectTarget: 6,
      ecoScoreTarget: 90
    },
    spawn: {
      entityIntervalMs: [470, 730],
      powerUpIntervalMs: [5200, 7600],
      bonusIntervalMs: [6000, 8200],
      maxEntities: 15,
      categoryWeights: {
        recyclable: 4,
        hazard: 6,
        satellite: 3,
        obstacle: 2
      },
      blueprintIds: [
        'recycle_can',
        'solar_panel_scrap',
        'battery_cluster',
        'toxic_cloud',
        'microplastic_swarm',
        'relay_satellite',
        'solar_station',
        'ice_comet'
      ]
    },
    educationalCard: {
      title: 'Microplasticos parecem pequenos, mas o impacto e gigante',
      fact: 'Particulas minusculas viajam facilmente e podem contaminar ambientes e equipamentos.',
      tip: 'Tecnologia e atencao ajudam a interromper poluicao antes que ela se espalhe.',
      summary: 'Agir cedo diminui o custo ambiental do descarte incorreto.'
    }
  },
  {
    id: 'junk_boss',
    order: 5,
    title: 'Monstro de Sucata Orbital',
    badge: 'Boss final',
    themeName: 'Recuperacao de uma orbita em colapso',
    description: 'A grande massa de sucata aparece cercada de residuos perigosos e exige tudo o que voce aprendeu.',
    gradient: 'linear-gradient(180deg, #111827 0%, #7f1d1d 48%, #1d4ed8 100%)',
    accentColor: '#ef4444',
    skyTop: 0x111827,
    skyBottom: 0x7f1d1d,
    soundtrack: 'boss',
    durationSeconds: 72,
    baseScrollSpeed: 0.24,
    missionLines: [
      'Neutralize o nucleo do monstro de sucata quando ele abrir caminho.',
      'Nao abandone os satelites durante a batalha final.',
      'O pulso de limpeza ajuda a conter ondas de detritos.'
    ],
    goals: {
      collectTarget: 8,
      neutralizeTarget: 10,
      protectTarget: 5,
      ecoScoreTarget: 96,
      bossDefeatRequired: true
    },
    spawn: {
      entityIntervalMs: [500, 760],
      powerUpIntervalMs: [5100, 7400],
      bonusIntervalMs: [6200, 8600],
      maxEntities: 15,
      categoryWeights: {
        recyclable: 2,
        hazard: 5,
        satellite: 3,
        obstacle: 3
      },
      blueprintIds: [
        'solar_panel_scrap',
        'battery_cluster',
        'toxic_cloud',
        'microplastic_swarm',
        'relay_satellite',
        'solar_station',
        'asteroid_chunk',
        'ice_comet'
      ]
    },
    educationalCard: {
      title: 'Limpeza orbital exige tecnologia e cooperacao',
      fact: 'Projetos reais estudam redes, imas e capturas controladas para retirar sucata da orbita.',
      tip: 'A melhor defesa e evitar gerar lixo. Depois, recuperar com criterio.',
      summary: 'Sustentabilidade espacial mistura prevencao, manutencao e recuperacao.'
    },
    boss: {
      blueprintId: 'junk_titan',
      hitPoints: 34,
      spawnAtSeconds: 22,
      minionBlueprintIds: ['battery_cluster', 'microplastic_swarm', 'toxic_cloud'],
      minionIntervalMs: 3200
    }
  }
]

export function getEcoNaveStage(stageId: EcoNaveStageId) {
  return ECONAVE_STAGES.find((stage) => stage.id === stageId) ?? null
}
