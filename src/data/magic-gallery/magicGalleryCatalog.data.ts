import type { MagicGalleryCharacterSeed, MagicGalleryCollection } from '@/types/magic-gallery'

export const magicGalleryCollections: MagicGalleryCollection[] = [
  {
    id: 'classic-friends',
    title: 'Turma Classica',
    description: 'Amigos brincalhoes que abrem a porta do mundo Plus.',
    color: '#2563eb',
    accent: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)'
  },
  {
    id: 'royal-sparkles',
    title: 'Coroas e Brilhos',
    description: 'Personagens com magia, coragem e vestidos cheios de luz.',
    color: '#ec4899',
    accent: '#be185d',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fae8ff 100%)'
  },
  {
    id: 'world-adventures',
    title: 'Aventuras do Mundo',
    description: 'Historias de viagem, musica, selva e descobertas encantadas.',
    color: '#f59e0b',
    accent: '#c2410c',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)'
  }
]

export const magicGalleryCharacterSeeds: MagicGalleryCharacterSeed[] = [
  {
    id: 'mickey-mouse',
    externalId: 4703,
    fallbackName: 'Mickey Mouse',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/2/2e/Disney_Mickey_Mouse.png',
    collectionId: 'classic-friends',
    storyTitle: 'Mickey and Friends',
    tagline: 'Capitao do portal das descobertas',
    description: 'Adora aventuras, pistas divertidas e comemorar cada nova amizade.',
    emoji: '🎩',
    rarity: 'legendary',
    themeTags: ['amizade', 'aventura', 'classico']
  },
  {
    id: 'minnie-mouse',
    externalId: 4704,
    fallbackName: 'Minnie Mouse',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/6/67/Minnie_Mouse.png',
    collectionId: 'classic-friends',
    storyTitle: 'Mickey and Friends',
    tagline: 'Charmosa guardia das estrelas',
    description: 'Organiza surpresas brilhantes e inspira colecoes caprichadas.',
    emoji: '🎀',
    rarity: 'epic',
    themeTags: ['amizade', 'estilo', 'classico']
  },
  {
    id: 'donald-duck',
    externalId: 1947,
    fallbackName: 'Donald Duck',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/a/ab/Donald_Duck_Disney_1.png',
    collectionId: 'classic-friends',
    storyTitle: 'Mickey and Friends',
    tagline: 'Explorador cheio de energia',
    description: 'Corre atras de tesouros, faz barulho e nunca perde o entusiasmo.',
    emoji: '🦆',
    rarity: 'rare',
    themeTags: ['amizade', 'humor', 'classico']
  },
  {
    id: 'daisy-duck',
    externalId: 1944,
    fallbackName: 'Daisy Duck',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/c/c9/Classic_Daisy_Duck.png',
    collectionId: 'classic-friends',
    storyTitle: 'Mickey and Friends',
    tagline: 'Faixa brilhante do album',
    description: 'Leva cor, ritmo e um toque glamouroso para a galeria encantada.',
    emoji: '💖',
    rarity: 'rare',
    themeTags: ['amizade', 'brilho', 'classico']
  },
  {
    id: 'goofy',
    externalId: 2755,
    fallbackName: 'Goofy',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/e/e5/Goofy.png',
    collectionId: 'classic-friends',
    storyTitle: 'Mickey and Friends',
    tagline: 'Guia de risadas do castelo',
    description: 'Transforma cada jogo em uma surpresa engracada e acolhedora.',
    emoji: '🎺',
    rarity: 'common',
    themeTags: ['amizade', 'humor', 'classico']
  },
  {
    id: 'ariel',
    externalId: 309,
    fallbackName: 'Ariel',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/8/8a/Profile_-_Ariel.jpg',
    collectionId: 'royal-sparkles',
    storyTitle: 'The Little Mermaid',
    tagline: 'Cantora das maresias magicas',
    description: 'Coleciona curiosidades do oceano e historias cheias de brilho.',
    emoji: '🪸',
    rarity: 'epic',
    themeTags: ['oceano', 'musica', 'coroa']
  },
  {
    id: 'rapunzel',
    externalId: 5614,
    fallbackName: 'Rapunzel',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/a/ae/Profile_-_Rapunzel.jpeg',
    collectionId: 'royal-sparkles',
    storyTitle: 'Tangled',
    tagline: 'Luzes douradas para novas pistas',
    description: 'Adora pintar, descobrir cantinhos secretos e iluminar o caminho.',
    emoji: '✨',
    rarity: 'epic',
    themeTags: ['arte', 'luz', 'coroa']
  },
  {
    id: 'tiana',
    externalId: 6737,
    fallbackName: 'Tiana',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/f/fa/Profile_-_Tiana.jpeg',
    collectionId: 'royal-sparkles',
    storyTitle: 'The Princess and the Frog',
    tagline: 'Chef das recompensas especiais',
    description: 'Mostra que cuidado, foco e carinho transformam qualquer jornada.',
    emoji: '🍀',
    rarity: 'rare',
    themeTags: ['coragem', 'cozinha', 'coroa']
  },
  {
    id: 'jasmine',
    externalId: 3390,
    fallbackName: 'Jasmine',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/d/df/Jasmine_Nolan.jpg',
    collectionId: 'royal-sparkles',
    storyTitle: 'Aladdin',
    tagline: 'Princesa de ventos dourados',
    description: 'Gosta de caminhos livres, aventuras e escolhas cheias de coragem.',
    emoji: '🪔',
    rarity: 'rare',
    themeTags: ['deserto', 'coragem', 'coroa']
  },
  {
    id: 'elsa',
    externalId: 2099,
    fallbackName: 'Elsa',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/9/95/Profile_-_Elsa.jpeg',
    collectionId: 'royal-sparkles',
    storyTitle: 'Frozen',
    tagline: 'Rainha das estrelas geladas',
    description: 'Cria trilhas brilhantes com calma, poder e muito autocuidado.',
    emoji: '❄️',
    rarity: 'legendary',
    themeTags: ['gelo', 'magia', 'coroa']
  },
  {
    id: 'anna',
    externalId: 256,
    fallbackName: 'Anna',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/0/0f/Profile_-_Anna.jpeg',
    collectionId: 'royal-sparkles',
    storyTitle: 'Frozen',
    tagline: 'Brilho caloroso do castelo',
    description: 'Entra nas missoes com coragem, abraco e muita vontade de ajudar.',
    emoji: '🧣',
    rarity: 'epic',
    themeTags: ['amizade', 'gelo', 'coroa']
  },
  {
    id: 'moana',
    externalId: 4591,
    fallbackName: 'Moana',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/7/7d/Profile_-_Moana.png',
    collectionId: 'world-adventures',
    storyTitle: 'Moana',
    tagline: 'Navegadora do destaque diario',
    description: 'Segue pistas do mar, do vento e do proprio coracao.',
    emoji: '🌊',
    rarity: 'legendary',
    themeTags: ['oceano', 'aventura', 'lideranca']
  },
  {
    id: 'stitch',
    externalId: 6448,
    fallbackName: 'Stitch',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/b/b7/Profile_-_Stitch.jpg',
    collectionId: 'world-adventures',
    storyTitle: 'Lilo & Stitch',
    tagline: 'Caos fofinho de energia azul',
    description: 'Agita a memoria, acelera as missoes e coleciona momentos inesqueciveis.',
    emoji: '💙',
    rarity: 'epic',
    themeTags: ['familia', 'espaco', 'aventura']
  },
  {
    id: 'simba',
    externalId: 6160,
    fallbackName: 'Simba',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/3/37/Profile_-_Simba.jpeg',
    collectionId: 'world-adventures',
    storyTitle: 'The Lion King',
    tagline: 'Guardiao dourado da savana',
    description: 'Lembra que crescer tambem e aprender com amigos e com a natureza.',
    emoji: '🦁',
    rarity: 'epic',
    themeTags: ['natureza', 'coragem', 'aventura']
  },
  {
    id: 'mirabel',
    externalId: 9159,
    fallbackName: 'Mirabel Madrigal',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/2/2e/Profile_-_Mirabel_Madrigal.png',
    collectionId: 'world-adventures',
    storyTitle: 'Encanto',
    tagline: 'Curadora das missoes em familia',
    description: 'Descobre talentos, pistas e jeitos de cuidar de todo mundo.',
    emoji: '🦋',
    rarity: 'rare',
    themeTags: ['familia', 'musica', 'aventura']
  },
  {
    id: 'aladdin',
    externalId: 156,
    fallbackName: 'Aladdin',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/disney/images/b/bb/Profile_-_Aladdin.png',
    collectionId: 'world-adventures',
    storyTitle: 'Aladdin',
    tagline: 'Aventureiro dos atalhos secretos',
    description: 'Encontra saidas criativas, voos inesperados e premios brilhantes.',
    emoji: '🪙',
    rarity: 'rare',
    themeTags: ['deserto', 'aventura', 'amizade']
  }
]

export const MAGIC_GALLERY_STARTER_CHARACTER_IDS = ['mickey-mouse', 'moana', 'rapunzel'] as const
