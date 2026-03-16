const soundMap = {
  correct: new URL('@/assets/audio/freesound_community-success-1-6297.mp3', import.meta.url).href,
  wrong: new URL('@/assets/audio/error.mp3', import.meta.url).href,
  celebration: new URL('@/assets/audio/success.mp3', import.meta.url).href
} as const

type SoundName = keyof typeof soundMap

class AppAudioService {
  private unlocked = false

  private players = new Map<SoundName, HTMLAudioElement>()

  private getPlayer(sound: SoundName) {
    if (typeof Audio === 'undefined') return null

    const cached = this.players.get(sound)
    if (cached) return cached

    const player = new Audio(soundMap[sound])
    player.preload = 'auto'
    player.volume = sound === 'celebration' ? 0.38 : 0.32
    this.players.set(sound, player)
    return player
  }

  unlock() {
    this.unlocked = true
  }

  private play(sound: SoundName) {
    if (!this.unlocked) return

    const player = this.getPlayer(sound)
    if (!player) return

    try {
      player.pause()
      player.currentTime = 0
      void player.play()
    } catch {
      // Evita que falhas de audio interrompam a experiencia.
    }
  }

  playSuccess() {
    this.play('correct')
  }

  playError() {
    this.play('wrong')
  }

  playCelebration() {
    this.play('celebration')
  }
}

export const audioService = new AppAudioService()

