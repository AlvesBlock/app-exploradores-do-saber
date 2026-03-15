const successAudioUrl = new URL('@/assets/audio/success.mp3', import.meta.url).href
const errorAudioUrl = new URL('@/assets/audio/error.mp3', import.meta.url).href

function safePlay(src: string) {
  try {
    const audio = new Audio(src)
    audio.volume = 0.45
    void audio.play()
  } catch {
    // evita quebrar o fluxo se o áudio falhar
  }
}

export const audioService = {
  playSuccess() {
    safePlay(successAudioUrl)
  },

  playError() {
    safePlay(errorAudioUrl)
  }
}