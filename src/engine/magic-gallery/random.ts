export function createSeedGenerator(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return () => {
    hash += hash << 13
    hash ^= hash >>> 7
    hash += hash << 3
    hash ^= hash >>> 17
    hash += hash << 5

    return ((hash >>> 0) % 1000) / 1000
  }
}

export function shuffleWithSeed<T>(items: T[], seed: string) {
  const nextRandom = createSeedGenerator(seed)
  const list = [...items]

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1))
    const currentItem = list[index]!
    list[index] = list[swapIndex]!
    list[swapIndex] = currentItem
  }

  return list
}

export function uniqueStrings(values: string[]) {
  return Array.from(new Set(values))
}
