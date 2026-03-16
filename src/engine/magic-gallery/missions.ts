import { createMissionReward } from '@/engine/magic-gallery/rewards'
import type {
  MagicGalleryActivityCounters,
  MagicGalleryCharacter,
  MagicGalleryMission,
  MagicGalleryMissionKind
} from '@/types/magic-gallery'

function getMissionProgress(kind: MagicGalleryMissionKind, counters: MagicGalleryActivityCounters) {
  switch (kind) {
    case 'reveal-daily':
      return counters.dailyRevealCount
    case 'complete-memory':
      return counters.memoryWins
    case 'complete-quiz':
      return counters.quizzesCompleted
    case 'unlock-gallery-item':
      return counters.galleryUnlocks
  }
}

export function createMagicGalleryDailyMissions(
  dateKey: string,
  highlightCharacter: MagicGalleryCharacter,
  counters: MagicGalleryActivityCounters,
  claims: string[],
): MagicGalleryMission[] {
  const missionTemplates: Array<{
    suffix: string
    kind: MagicGalleryMissionKind
    icon: string
    title: string
    description: string
    target: number
  }> = [
    {
      suffix: 'daily',
      kind: 'reveal-daily',
      icon: '✨',
      title: 'Abrir o brilho do dia',
      description: `Revele o personagem misterioso inspirado em ${highlightCharacter.name}.`,
      target: 1
    },
    {
      suffix: 'memory',
      kind: 'complete-memory',
      icon: '🧠',
      title: 'Vencer a memoria',
      description: 'Complete uma rodada da memoria encantada.',
      target: 1
    },
    {
      suffix: 'quiz',
      kind: 'complete-quiz',
      icon: '🔎',
      title: 'Responder o quiz',
      description: 'Conclua uma trilha curta do quiz de descoberta.',
      target: 1
    },
    {
      suffix: 'album',
      kind: 'unlock-gallery-item',
      icon: '📖',
      title: 'Revelar uma figurinha',
      description: 'Desbloqueie um novo personagem no album premium.',
      target: 1
    }
  ]

  return missionTemplates.map((template) => {
    const id = `${dateKey}:${template.suffix}`
    const progress = Math.min(template.target, getMissionProgress(template.kind, counters))

    return {
      id,
      dateKey,
      kind: template.kind,
      icon: template.icon,
      title: template.title,
      description: template.description,
      target: template.target,
      progress,
      completed: progress >= template.target,
      claimedAt: claims.includes(id) ? dateKey : null,
      reward: createMissionReward(template.kind)
    }
  })
}
