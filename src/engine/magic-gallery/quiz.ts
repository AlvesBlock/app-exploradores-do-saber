import { shuffleWithSeed, uniqueStrings } from '@/engine/magic-gallery/random'
import type { MagicGalleryCharacter, MagicGalleryQuizOption, MagicGalleryQuizQuestion } from '@/types/magic-gallery'

function getPrimaryStoryTitle(character: MagicGalleryCharacter) {
  return character.sourceTitles[0] ?? character.storyTitle
}

function createStoryOptions(
  characters: MagicGalleryCharacter[],
  character: MagicGalleryCharacter,
  seed: string,
): MagicGalleryQuizOption[] {
  const correctStory = getPrimaryStoryTitle(character)
  const otherStories = uniqueStrings(
    characters.map((item) => getPrimaryStoryTitle(item)).filter((title) => title !== correctStory),
  )

  return shuffleWithSeed(
    [
      { id: correctStory, label: correctStory },
      ...shuffleWithSeed(otherStories, `${seed}:stories`).slice(0, 3).map((title) => ({
        id: title,
        label: title
      }))
    ],
    `${seed}:story-options`,
  )
}

function createCharacterOptions(
  characters: MagicGalleryCharacter[],
  character: MagicGalleryCharacter,
  seed: string,
): MagicGalleryQuizOption[] {
  return shuffleWithSeed(
    [
      { id: character.id, label: character.name, emoji: character.emoji },
      ...shuffleWithSeed(
        characters.filter((item) => item.id !== character.id),
        `${seed}:characters`,
      )
        .slice(0, 3)
        .map((item) => ({
          id: item.id,
          label: item.name,
          emoji: item.emoji
        }))
    ],
    `${seed}:character-options`,
  )
}

function buildStoryQuestion(
  characters: MagicGalleryCharacter[],
  character: MagicGalleryCharacter,
  seed: string,
): MagicGalleryQuizQuestion {
  const correctStory = getPrimaryStoryTitle(character)

  return {
    id: `story:${character.id}`,
    kind: 'match-character-to-story',
    prompt: `Qual historia combina com ${character.name}?`,
    supportingText: character.tagline,
    characterId: character.id,
    options: createStoryOptions(characters, character, seed),
    correctOptionId: correctStory,
    explanation: `${character.name} brilha em ${correctStory} e faz parte da colecao ${character.collectionTitle}.`
  }
}

function buildCharacterQuestion(
  characters: MagicGalleryCharacter[],
  character: MagicGalleryCharacter,
  seed: string,
): MagicGalleryQuizQuestion {
  const storyTitle = getPrimaryStoryTitle(character)

  return {
    id: `character:${character.id}`,
    kind: 'match-story-to-character',
    prompt: `Quem mora no mundo de ${storyTitle}?`,
    supportingText: `Colecao ${character.collectionTitle}`,
    characterId: character.id,
    options: createCharacterOptions(characters, character, seed),
    correctOptionId: character.id,
    explanation: `${character.name} pertence a ${storyTitle} e leva o tema ${character.tagline.toLowerCase()}.`
  }
}

export function generateMagicGalleryQuizQuestions(
  characters: MagicGalleryCharacter[],
  seed: string,
  questionCount = 5,
): MagicGalleryQuizQuestion[] {
  const shuffledCharacters = shuffleWithSeed(characters, `${seed}:question-characters`)

  const storyQuestions = shuffledCharacters.map((character, index) =>
    buildStoryQuestion(characters, character, `${seed}:story:${index}`),
  )
  const characterQuestions = shuffledCharacters.map((character, index) =>
    buildCharacterQuestion(characters, character, `${seed}:character:${index}`),
  )

  return shuffleWithSeed([...storyQuestions, ...characterQuestions], `${seed}:quiz-bank`).slice(
    0,
    questionCount,
  )
}
