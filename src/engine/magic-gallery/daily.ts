import { shuffleWithSeed } from '@/engine/magic-gallery/random'
import type { MagicGalleryCharacter } from '@/types/magic-gallery'

export function pickMagicGalleryDailyCharacter(characters: MagicGalleryCharacter[], dateKey: string) {
  return shuffleWithSeed(characters, `${dateKey}:daily-highlight`)[0] ?? null
}
