import educationalCardsJson from '@/engine/runner/data/educational-cards.json'
import type {
    EducationalCard,
    EducationalCardsCollection,
    EducationalCardPickInput
} from '@/types/runner-game'

const educationalCards = educationalCardsJson as EducationalCardsCollection

function isCardAvailableForRound(card: EducationalCard, roundNumber: number): boolean {
    return roundNumber >= card.minRound && roundNumber <= card.maxRound
}

function pickRandomItem<T>(items: T[]): T | null {
    if (!items.length) return null
    const index = Math.floor(Math.random() * items.length)
    return items[index] ?? null
}

export function getEducationalCardsByType(type: 'victory' | 'defeat'): EducationalCard[] {
    return type === 'victory'
        ? educationalCards.cards.victoryCards
        : educationalCards.cards.defeatCards
}

export function getEligibleEducationalCards(
    type: 'victory' | 'defeat',
    roundNumber: number
): EducationalCard[] {
    return getEducationalCardsByType(type).filter(card =>
        isCardAvailableForRound(card, roundNumber)
    )
}

export function pickEducationalCard(
    input: EducationalCardPickInput
): EducationalCard | null {
    const eligibleCards = getEligibleEducationalCards(
        input.completionStatus,
        input.roundNumber
    )

    const picked = pickRandomItem(eligibleCards)
    if (picked) return picked

    const fallbackCards = getEducationalCardsByType(input.completionStatus)
    return pickRandomItem(fallbackCards)
}