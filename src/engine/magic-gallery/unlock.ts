import type { ModuleProgress } from '@/types/module'
import type { MagicGalleryProgress, MagicGalleryUnlockStatus } from '@/types/magic-gallery'

export function getCompletedRequiredModules(progressList: ModuleProgress[]) {
  return progressList.filter((item) => !!item.completedAt).length
}

export function canUnlockMagicGallery(progressList: ModuleProgress[]) {
  if (progressList.length === 0) return false
  return progressList.every((item) => !!item.completedAt)
}

export function resolveMagicGalleryUnlockStatus(
  progressList: ModuleProgress[],
  magicGalleryProgress: MagicGalleryProgress,
): MagicGalleryUnlockStatus {
  const totalRequiredModules = progressList.length
  const completedRequiredModules = getCompletedRequiredModules(progressList)
  const remainingModules = Math.max(0, totalRequiredModules - completedRequiredModules)
  const unlocked = !!magicGalleryProgress.unlockedAt
  const celebrationPending = unlocked && !magicGalleryProgress.unlockCelebrationSeenAt
  const hasVisited = !!magicGalleryProgress.firstVisitedAt

  let status: MagicGalleryUnlockStatus['status']
  if (!unlocked) {
    status = remainingModules <= 1 ? 'almost-unlocked' : 'locked'
  } else if (celebrationPending) {
    status = 'just-unlocked'
  } else if (hasVisited) {
    status = 'visited'
  } else {
    status = 'available'
  }

  const progressPercent =
    totalRequiredModules > 0 ? (completedRequiredModules / totalRequiredModules) * 100 : 0

  const copyByStatus: Record<
    MagicGalleryUnlockStatus['status'],
    Pick<MagicGalleryUnlockStatus, 'requirementText' | 'helperText' | 'ctaLabel'>
  > = {
    locked: {
      requirementText: 'Conclua os mundos principais para liberar o espaco Plus.',
      helperText: `Faltam ${remainingModules} modulo(s) para abrir o portal dourado.`,
      ctaLabel: 'Bloqueado'
    },
    'almost-unlocked': {
      requirementText: 'Voce esta quase la: falta so mais um passo.',
      helperText: 'Complete o ultimo modulo principal para revelar a surpresa premium.',
      ctaLabel: 'Quase liberado'
    },
    'just-unlocked': {
      requirementText: 'Portal Plus liberado!',
      helperText: 'Uma nova galeria magica acabou de chegar ao seu Hub.',
      ctaLabel: 'Entrar agora'
    },
    available: {
      requirementText: 'Seu espaco premium esta pronto para ser explorado.',
      helperText: 'Entre para revelar personagens, jogar e colecionar recompensas.',
      ctaLabel: 'Abrir Galeria'
    },
    visited: {
      requirementText: 'A Galeria Encantada segue brilhando no seu Hub.',
      helperText: 'Continue suas colecoes, missoes e descobertas especiais.',
      ctaLabel: 'Continuar aventura'
    }
  }

  return {
    featureId: 'magic-gallery',
    status,
    totalRequiredModules,
    completedRequiredModules,
    remainingModules,
    progressPercent,
    unlocked,
    unlockedAt: magicGalleryProgress.unlockedAt,
    celebrationPending,
    hasVisited,
    requirementText: copyByStatus[status].requirementText,
    helperText: copyByStatus[status].helperText,
    ctaLabel: copyByStatus[status].ctaLabel
  }
}
