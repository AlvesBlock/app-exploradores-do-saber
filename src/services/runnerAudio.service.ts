import type { RunnerFeedbackEvent } from '@/types/runner-game'

const collectAudioUrl = new URL('@/assets/audio/splash.mp3', import.meta.url).href
const hitAudioUrl = new URL('@/assets/audio/explode.mp3', import.meta.url).href
const shieldAudioUrl = new URL('@/assets/audio/success.mp3', import.meta.url).href
const victoryAudioUrl = new URL('@/assets/audio/freesound_community-success-68578.mp3', import.meta.url).href
const softSuccessAudioUrl = new URL('@/assets/audio/freesound_community-success-1-6297.mp3', import.meta.url).href
const warningAudioUrl = new URL('@/assets/audio/error.mp3', import.meta.url).href
const gameOverAudioUrl = new URL('@/assets/audio/universfield-error-119113.mp3', import.meta.url).href
const themeLightUrl = new URL('@/assets/audio/tema1.mp3', import.meta.url).href
const themePressureUrl = new URL('@/assets/audio/tema2.mp3', import.meta.url).href

function safePlay(src: string, volume = 0.45) {
  try {
    const audio = new Audio(src)
    audio.volume = volume
    void audio.play()
  } catch {
    // Browser policies can block audio. The gameplay should keep running.
  }
}

let musicAudio: HTMLAudioElement | null = null
let currentMusicSrc = ''

function ensureMusic(src: string) {
  if (musicAudio && currentMusicSrc === src) {
    return musicAudio
  }

  if (musicAudio) {
    musicAudio.pause()
  }

  musicAudio = new Audio(src)
  musicAudio.loop = true
  musicAudio.volume = 0.22
  currentMusicSrc = src

  return musicAudio
}

export const runnerAudioService = {
  playCollect() {
    safePlay(collectAudioUrl, 0.34)
  },

  playHit() {
    safePlay(hitAudioUrl, 0.42)
  },

  playEvent(event: RunnerFeedbackEvent) {
    if (event.kind === 'collect') {
      safePlay(event.tone === 'positive' ? softSuccessAudioUrl : collectAudioUrl, 0.36)
      return
    }

    if (event.kind === 'warning') {
      safePlay(warningAudioUrl, 0.26)
      return
    }

    if (event.kind === 'shield' || event.kind === 'block' || event.kind === 'heal') {
      safePlay(shieldAudioUrl, 0.3)
      return
    }

    if (event.kind === 'hit') {
      safePlay(hitAudioUrl, 0.45)
      return
    }

    if (event.kind === 'round') {
      safePlay(event.tone === 'negative' ? gameOverAudioUrl : victoryAudioUrl, 0.4)
    }
  },

  playRoundOutcome(victory: boolean) {
    safePlay(victory ? victoryAudioUrl : gameOverAudioUrl, victory ? 0.38 : 0.32)
  },

  playMusic(roundNumber: number) {
    try {
      const track = roundNumber >= 6 ? themePressureUrl : themeLightUrl
      const audio = ensureMusic(track)

      if (audio.paused) {
        void audio.play()
      }
    } catch {
      //
    }
  },

  pauseMusic() {
    try {
      musicAudio?.pause()
    } catch {
      //
    }
  },

  stopMusic() {
    try {
      if (!musicAudio) {
        return
      }

      musicAudio.pause()
      musicAudio.currentTime = 0
    } catch {
      //
    }
  }
}
