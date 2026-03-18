import type { AvatarMeta, AvatarOption } from '@/types/player'

export const avatarOptions: AvatarMeta[] = [
  {
    value: 'mascote-coelho',
    label: 'Estherzinha',
    emoji: '👧🏽',
    description: 'Gosta de rosa e de brincar.',
    accentColor: '#f852c6'
  },
  {
    value: 'mascote-coelho',
    label: 'Luna Coelha',
    emoji: '🐰',
    description: 'Ama pistas rapidas, desafios leves e descobertas alegres.',
    accentColor: '#f59e0b'
  },
  {
    value: 'exploradora-espacial',
    label: 'Nina Espacial',
    emoji: '🧑‍🚀',
    description: 'Adora explorar mundos, mapas e novas perguntas.',
    accentColor: '#2563eb'
  },
  {
    value: 'cientista-criativa',
    label: 'Theo Cientista',
    emoji: '🧑‍🔬',
    description: 'Observa tudo com calma e transforma curiosidade em resposta.',
    accentColor: '#10b981'
  },
  {
    value: 'artista-das-cores',
    label: 'Bela Artista',
    emoji: '🧑‍🎨',
    description: 'Gosta de palavras, imagens e ideias cheias de cor.',
    accentColor: '#ec4899'
  },
  {
    value: 'inventora-em-movimento',
    label: 'Jo Inventora',
    emoji: '🧑‍🦽',
    description: 'Resolve missões com criatividade, tecnologia e coragem.',
    accentColor: '#8b5cf6'
  },
  {
    value: 'guardiao-da-floresta',
    label: 'Caio Guardiao',
    emoji: '🧑‍🌾',
    description: 'Cuida da natureza e encontra pistas em cada trilha.',
    accentColor: '#16a34a'
  }
]

const legacyAvatarMap: Record<string, AvatarOption> = {
  coelho: 'mascote-coelho',
  cientista: 'cientista-criativa',
  menino: 'exploradora-espacial',
  menina: 'artista-das-cores'
}

export function normalizeAvatarOption(value: string | null | undefined): AvatarOption {
  if (!value) return 'mascote-coelho'

  const directMatch = avatarOptions.find((option) => option.value === value)
  if (directMatch) return directMatch.value

  return legacyAvatarMap[value] ?? 'mascote-coelho'
}

export function getAvatarMeta(avatar: AvatarOption | null | undefined): AvatarMeta {
  const normalized = normalizeAvatarOption(avatar)
  return avatarOptions.find((option) => option.value === normalized) ?? avatarOptions[0]!
}
