import confetti from 'canvas-confetti'

function reducedMotionEnabled() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const celebrationService = {
  fireModuleCompletion() {
    if (reducedMotionEnabled()) return

    confetti({
      particleCount: 120,
      spread: 88,
      startVelocity: 38,
      origin: { y: 0.64 }
    })

    window.setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 110,
        scalar: 0.92,
        origin: { y: 0.52 }
      })
    }, 180)
  }
}

