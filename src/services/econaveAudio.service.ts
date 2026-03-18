import type { EcoNaveAudioCue, EcoNaveMusicTrack, EcoNavePreferences } from '@/types/econave'

type OscillatorTypeName = OscillatorType

interface Note {
  frequency: number
  duration: number
  gain: number
  type: OscillatorTypeName
}

const MUSIC_TRACKS: Record<EcoNaveMusicTrack, Note[]> = {
  orbital: [
    { frequency: 261.63, duration: 0.28, gain: 0.05, type: 'triangle' },
    { frequency: 329.63, duration: 0.22, gain: 0.04, type: 'triangle' },
    { frequency: 392.0, duration: 0.38, gain: 0.05, type: 'sine' },
    { frequency: 329.63, duration: 0.24, gain: 0.04, type: 'triangle' }
  ],
  storm: [
    { frequency: 220.0, duration: 0.22, gain: 0.05, type: 'square' },
    { frequency: 277.18, duration: 0.22, gain: 0.045, type: 'triangle' },
    { frequency: 329.63, duration: 0.28, gain: 0.05, type: 'triangle' },
    { frequency: 246.94, duration: 0.26, gain: 0.04, type: 'square' }
  ],
  boss: [
    { frequency: 164.81, duration: 0.18, gain: 0.06, type: 'sawtooth' },
    { frequency: 196.0, duration: 0.18, gain: 0.05, type: 'sawtooth' },
    { frequency: 246.94, duration: 0.24, gain: 0.055, type: 'triangle' },
    { frequency: 196.0, duration: 0.26, gain: 0.05, type: 'sawtooth' }
  ]
}

const EFFECTS: Record<EcoNaveAudioCue, Note[]> = {
  fire: [{ frequency: 520, duration: 0.08, gain: 0.05, type: 'square' }],
  collect: [
    { frequency: 660, duration: 0.08, gain: 0.05, type: 'triangle' },
    { frequency: 880, duration: 0.09, gain: 0.04, type: 'triangle' }
  ],
  error: [
    { frequency: 220, duration: 0.11, gain: 0.05, type: 'square' },
    { frequency: 180, duration: 0.14, gain: 0.04, type: 'square' }
  ],
  damage: [{ frequency: 120, duration: 0.16, gain: 0.06, type: 'sawtooth' }],
  powerup: [
    { frequency: 523.25, duration: 0.07, gain: 0.05, type: 'triangle' },
    { frequency: 659.25, duration: 0.08, gain: 0.05, type: 'triangle' },
    { frequency: 783.99, duration: 0.1, gain: 0.04, type: 'triangle' }
  ],
  alert: [{ frequency: 320, duration: 0.1, gain: 0.04, type: 'square' }],
  victory: [
    { frequency: 523.25, duration: 0.12, gain: 0.05, type: 'triangle' },
    { frequency: 659.25, duration: 0.12, gain: 0.05, type: 'triangle' },
    { frequency: 783.99, duration: 0.16, gain: 0.05, type: 'triangle' }
  ],
  defeat: [
    { frequency: 220, duration: 0.14, gain: 0.05, type: 'sawtooth' },
    { frequency: 174.61, duration: 0.16, gain: 0.04, type: 'sawtooth' }
  ],
  pulse: [
    { frequency: 440, duration: 0.1, gain: 0.06, type: 'sine' },
    { frequency: 220, duration: 0.12, gain: 0.05, type: 'triangle' }
  ],
  boss: [
    { frequency: 155.56, duration: 0.08, gain: 0.06, type: 'sawtooth' },
    { frequency: 311.13, duration: 0.12, gain: 0.04, type: 'triangle' }
  ]
}

class EcoNaveAudioService {
  private context: AudioContext | null = null

  private masterGain: GainNode | null = null

  private sfxGain: GainNode | null = null

  private musicGain: GainNode | null = null

  private currentTrack: EcoNaveMusicTrack | null = null

  private musicTimer: number | null = null

  private noteHandles = new Set<AudioScheduledSourceNode>()

  private unlocked = false

  private settings: EcoNavePreferences = {
    muted: false,
    musicMuted: false,
    sfxVolume: 0.72,
    musicVolume: 0.42,
    quality: 'high'
  }

  private lastCueTimes = new Map<EcoNaveAudioCue, number>()

  private ensureContext() {
    if (typeof window === 'undefined') {
      return null
    }

    const AudioCtor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioCtor) {
      return null
    }

    if (this.context && this.masterGain && this.sfxGain && this.musicGain) {
      return this.context
    }

    this.context = new AudioCtor()
    this.masterGain = this.context.createGain()
    this.sfxGain = this.context.createGain()
    this.musicGain = this.context.createGain()

    this.sfxGain.connect(this.masterGain)
    this.musicGain.connect(this.masterGain)
    this.masterGain.connect(this.context.destination)
    this.applySettings(this.settings)

    return this.context
  }

  private scheduleNotes(notes: Note[], destination: GainNode, startAt: number) {
    const context = this.context
    if (!context) return 0

    let cursor = startAt

    notes.forEach((note) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = note.type
      oscillator.frequency.setValueAtTime(note.frequency, cursor)
      gain.gain.setValueAtTime(note.gain, cursor)
      gain.gain.exponentialRampToValueAtTime(0.0001, cursor + note.duration)
      oscillator.connect(gain)
      gain.connect(destination)
      oscillator.start(cursor)
      oscillator.stop(cursor + note.duration + 0.02)
      oscillator.onended = () => {
        oscillator.disconnect()
        gain.disconnect()
        this.noteHandles.delete(oscillator)
      }
      this.noteHandles.add(oscillator)
      cursor += note.duration + 0.02
    })

    return cursor - startAt
  }

  private scheduleMusicLoop() {
    const context = this.context
    if (!context || !this.musicGain || !this.currentTrack || this.settings.muted || this.settings.musicMuted) {
      return
    }

    const duration = this.scheduleNotes(MUSIC_TRACKS[this.currentTrack], this.musicGain, context.currentTime + 0.04)
    this.musicTimer = window.setTimeout(() => this.scheduleMusicLoop(), duration * 1000)
  }

  unlock() {
    const context = this.ensureContext()
    if (!context) {
      return
    }

    this.unlocked = true
    void context
      .resume()
      .then(() => {
        if (this.currentTrack && this.musicTimer === null) {
          this.scheduleMusicLoop()
        }
      })
      .catch(() => {
        // Browser policy can block audio; the game must continue without failing.
      })
  }

  applySettings(settings: EcoNavePreferences) {
    this.settings = settings
    this.masterGain?.gain.setValueAtTime(settings.muted ? 0 : 1, this.context?.currentTime ?? 0)
    this.sfxGain?.gain.setValueAtTime(settings.muted ? 0 : settings.sfxVolume, this.context?.currentTime ?? 0)
    this.musicGain?.gain.setValueAtTime(
      settings.muted || settings.musicMuted ? 0 : settings.musicVolume,
      this.context?.currentTime ?? 0,
    )
  }

  playCue(cue: EcoNaveAudioCue) {
    if (!this.unlocked || this.settings.muted) {
      return
    }

    const context = this.ensureContext()
    if (!context || !this.sfxGain) {
      return
    }

    const now = performance.now()
    const lastTime = this.lastCueTimes.get(cue) ?? 0
    if (now - lastTime < 70) {
      return
    }

    this.lastCueTimes.set(cue, now)
    this.scheduleNotes(EFFECTS[cue], this.sfxGain, context.currentTime + 0.01)
  }

  startMusic(track: EcoNaveMusicTrack) {
    this.currentTrack = track

    if (!this.unlocked) {
      return
    }

    this.stopMusic()
    this.currentTrack = track

    if (this.settings.muted || this.settings.musicMuted) {
      return
    }

    this.scheduleMusicLoop()
  }

  pause() {
    try {
      void this.context?.suspend()
    } catch {
      //
    }
  }

  resume() {
    if (!this.unlocked) {
      return
    }

    try {
      void this.context?.resume()
    } catch {
      //
    }
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer)
      this.musicTimer = null
    }
  }

  destroy() {
    this.stopMusic()

    this.noteHandles.forEach((handle) => {
      try {
        handle.stop()
      } catch {
        //
      }
    })

    this.noteHandles.clear()
    this.context = null
    this.masterGain = null
    this.sfxGain = null
    this.musicGain = null
    this.currentTrack = null
    this.unlocked = false
  }
}

export const econaveAudioService = new EcoNaveAudioService()
