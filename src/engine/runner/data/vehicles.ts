import type { RunnerVehicle } from '@/types/runner-game'

export const RUNNER_VEHICLES: RunnerVehicle[] = [
  {
    id: 'recycled_skate',
    name: 'Skate Reciclado',
    emoji: '🛹',
    unlockCoins: 0,
    unlockCarbonCredits: 0,
    tier: 1,
    description: 'Veículo inicial leve, reaproveitado e ágil.',
    benefits: {
      laneSwitchSpeed: 1.1,
      shieldChargeBonus: 0,
      coinBonusPercent: 0,
      ecoScoreBonusPercent: 0,
      collisionProtection: 0
    },
    educationalBenefit: 'Reutilizar materiais reduz desperdício e prolonga a vida útil de objetos.',
    flavorText: 'Comece pequeno, mas com consciência.'
  },
  {
    id: 'electric_scooter',
    name: 'Patinete Elétrico',
    emoji: '🛴',
    unlockCoins: 60,
    unlockCarbonCredits: 12,
    tier: 2,
    description: 'Mais estável e eficiente para percursos urbanos curtos.',
    benefits: {
      laneSwitchSpeed: 1.15,
      shieldChargeBonus: 0.05,
      coinBonusPercent: 5,
      ecoScoreBonusPercent: 0,
      collisionProtection: 0
    },
    educationalBenefit: 'Patinetes elétricos podem reduzir uso de carros em trajetos curtos.',
    flavorText: 'Mobilidade prática com baixa emissão.'
  },
  {
    id: 'urban_bicycle',
    name: 'Bicicleta Urbana',
    emoji: '🚲',
    unlockCoins: 120,
    unlockCarbonCredits: 24,
    tier: 3,
    description: 'Equilíbrio entre controle, eficiência e coleta qualificada.',
    benefits: {
      laneSwitchSpeed: 1.12,
      shieldChargeBonus: 0.08,
      coinBonusPercent: 0,
      ecoScoreBonusPercent: 8,
      collisionProtection: 0
    },
    educationalBenefit: 'Bicicletas não emitem poluentes diretamente e ajudam a reduzir congestionamento.',
    flavorText: 'Silenciosa, limpa e eficiente.'
  },
  {
    id: 'cargo_bike',
    name: 'Bike Cargo Sustentável',
    emoji: '🚴',
    unlockCoins: 190,
    unlockCarbonCredits: 38,
    tier: 4,
    description: 'Melhora a coleta qualificada, ideal para rounds exigentes.',
    benefits: {
      laneSwitchSpeed: 1.0,
      shieldChargeBonus: 0.1,
      coinBonusPercent: 8,
      ecoScoreBonusPercent: 12,
      collisionProtection: 0
    },
    educationalBenefit: 'Bikes cargo substituem veículos motorizados em entregas urbanas leves.',
    flavorText: 'Carrega mais impacto positivo por percurso.'
  },
  {
    id: 'green_scooter',
    name: 'Scooter Elétrica Verde',
    emoji: '🛵',
    unlockCoins: 280,
    unlockCarbonCredits: 55,
    tier: 5,
    description: 'Boa velocidade com carga de escudo mais rápida.',
    benefits: {
      laneSwitchSpeed: 1.08,
      shieldChargeBonus: 0.18,
      coinBonusPercent: 5,
      ecoScoreBonusPercent: 5,
      collisionProtection: 0
    },
    educationalBenefit: 'Scooters elétricas podem contribuir para cidades menos ruidosas e menos poluentes.',
    flavorText: 'Energia limpa com resposta rápida.'
  },
  {
    id: 'solar_microcar',
    name: 'Microcarro Solar',
    emoji: '🚗',
    unlockCoins: 380,
    unlockCarbonCredits: 80,
    tier: 6,
    description: 'Aumenta a conversão ecológica em créditos de carbono.',
    benefits: {
      laneSwitchSpeed: 0.98,
      shieldChargeBonus: 0.12,
      coinBonusPercent: 0,
      ecoScoreBonusPercent: 15,
      collisionProtection: 0.05
    },
    educationalBenefit: 'Energia solar ajuda a reduzir dependência de fontes fósseis.',
    flavorText: 'Cada raio de sol vira vantagem ambiental.'
  },
  {
    id: 'shared_ecocar',
    name: 'EcoCarro Compartilhado',
    emoji: '🚙',
    unlockCoins: 520,
    unlockCarbonCredits: 110,
    tier: 7,
    description: 'Maior proteção passiva, ideal para rounds de alta pressão.',
    benefits: {
      laneSwitchSpeed: 0.95,
      shieldChargeBonus: 0.1,
      coinBonusPercent: 6,
      ecoScoreBonusPercent: 8,
      collisionProtection: 0.12
    },
    educationalBenefit: 'Compartilhamento de veículos reduz tráfego e emissões por pessoa.',
    flavorText: 'Menos carros, mais eficiência.'
  },
  {
    id: 'clean_energy_concept',
    name: 'Veículo Conceito de Energia Limpa',
    emoji: '🚘',
    unlockCoins: 700,
    unlockCarbonCredits: 150,
    tier: 8,
    description: 'Veículo endgame com bônus equilibrados de desempenho sustentável.',
    benefits: {
      laneSwitchSpeed: 1.05,
      shieldChargeBonus: 0.2,
      coinBonusPercent: 10,
      ecoScoreBonusPercent: 15,
      collisionProtection: 0.1
    },
    educationalBenefit: 'Tecnologias limpas combinam eficiência energética, inovação e menor impacto ambiental.',
    flavorText: 'O futuro da mobilidade verde chegou.'
  }
]

export function getRunnerVehicleById(id: string): RunnerVehicle | undefined {
  return RUNNER_VEHICLES.find(item => item.id === id)
}