export type AvatarOption =
  | 'mascote-coelho'
  | 'exploradora-espacial'
  | 'cientista-criativa'
  | 'artista-das-cores'
  | 'inventora-em-movimento'
  | 'guardiao-da-floresta'

export interface AvatarMeta {
  value: AvatarOption
  label: string
  emoji: string
  description: string
  accentColor: string
}

export interface PlayerProfile {
  name: string
  avatar: AvatarOption
  stars: number
  createdAt: string
  lastActiveAt: string
}

