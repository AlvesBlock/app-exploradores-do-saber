const collectAudioUrl = new URL('@/assets/audio/splash.mp3', import.meta.url).href
const hitAudioUrl = new URL('@/assets/audio/explode.mp3', import.meta.url).href

function safePlay(src: string, volume = 0.45) {
  try {
    const audio = new Audio(src)
    audio.volume = volume
    void audio.play()
  } catch {
    // evita quebrar a experiência se o browser bloquear o áudio
  }
}

export const runnerAudioService = {
  playCollect() {
    safePlay(collectAudioUrl, 0.35)
  },

  playHit() {
    safePlay(hitAudioUrl, 0.5)
  }
}