export type AvatarOption = 'coelho' | 'cientista' | 'menino' | 'menina'

export interface PlayerProfile {
  name: string
  avatar: AvatarOption
  stars: number
}