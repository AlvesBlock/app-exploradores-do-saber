import type {
  EcoNaveEntity,
  EcoNavePowerUpType,
  EcoNaveRulesResult
} from '@/types/econave'

function makeRulesResult(
  overrides: Partial<EcoNaveRulesResult>,
  fallbackText: string,
): EcoNaveRulesResult {
  return {
    positive: false,
    removeEntity: true,
    projectileConsumed: true,
    playerDamage: 0,
    shieldBlocked: false,
    scoreDelta: 0,
    ecoDelta: 0,
    creditDelta: 0,
    collectDelta: 0,
    neutralizeDelta: 0,
    protectedDelta: 0,
    lostSatelliteDelta: 0,
    bossDamage: 0,
    powerUpGranted: null,
    feedback: {
      tone: 'warning',
      text: fallbackText,
      icon: '⚠️',
      cue: 'alert'
    },
    ...overrides
  }
}

function formatPowerUpText(powerUpType: EcoNavePowerUpType) {
  switch (powerUpType) {
    case 'shield':
      return { icon: '🛡️', text: 'Escudo orbital pronto para absorver impactos.' }
    case 'magnet':
      return { icon: '🧲', text: 'Ima ativo: os residuos corretos chegam ate voce.' }
    case 'cleanup_pulse':
      return { icon: '💥', text: 'Pulso de limpeza carregado para emergencias.' }
    case 'classifier':
      return { icon: '📷', text: 'Camera ativa: classifique reciclaveis com mais seguranca.' }
    case 'turbo':
      return { icon: '⚡', text: 'Turbo solar liberado. Mais agilidade e cadencia.' }
    case 'time_slow':
      return { icon: '⏳', text: 'Janela tatica aberta. O fluxo orbital desacelerou.' }
  }
}

export function resolveEcoNavePlayerCollision(entity: EcoNaveEntity): EcoNaveRulesResult {
  if (entity.kind === 'recyclable') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: entity.scoreValue,
        ecoDelta: entity.ecoValue,
        creditDelta: entity.creditValue,
        collectDelta: 1,
        feedback: {
          tone: 'positive',
          text: `Boa coleta: ${entity.emoji} foi separado corretamente.`,
          icon: '♻️',
          cue: 'collect'
        }
      },
      'Coleta correta.'
    )
  }

  if (entity.kind === 'hazard') {
    return makeRulesResult(
      {
        playerDamage: entity.damage,
        scoreDelta: -16,
        ecoDelta: -12,
        feedback: {
          tone: 'negative',
          text: `${entity.emoji} e perigoso. Neutralize com o pulso eco, nao toque nele.`,
          icon: '☣️',
          cue: 'damage'
        }
      },
      'Residuo perigoso requer neutralizacao.'
    )
  }

  if (entity.kind === 'satellite') {
    return makeRulesResult(
      {
        playerDamage: 10,
        lostSatelliteDelta: 1,
        scoreDelta: -22,
        ecoDelta: -18,
        feedback: {
          tone: 'negative',
          text: `${entity.emoji} e infraestrutura util. Proteja, nao colida.`,
          icon: '🛰️',
          cue: 'error'
        }
      },
      'Estrutura util protegida.'
    )
  }

  if (entity.kind === 'obstacle') {
    return makeRulesResult(
      {
        playerDamage: entity.damage,
        scoreDelta: -10,
        ecoDelta: -6,
        feedback: {
          tone: 'warning',
          text: `${entity.emoji} e um obstaculo natural. Desvie para manter a nave segura.`,
          icon: '🪨',
          cue: 'damage'
        }
      },
      'Obstaculo natural.'
    )
  }

  if (entity.kind === 'bonus') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: entity.scoreValue,
        ecoDelta: entity.ecoValue,
        creditDelta: entity.creditValue,
        feedback: {
          tone: 'mission',
          text: 'Bonus educativo coletado. Quanto mais voce entende, melhor joga.',
          icon: '📘',
          cue: 'collect'
        }
      },
      'Bonus educativo.'
    )
  }

  if (entity.kind === 'powerup' && entity.powerUpType) {
    const details = formatPowerUpText(entity.powerUpType)

    return makeRulesResult(
      {
        positive: true,
        scoreDelta: entity.scoreValue,
        ecoDelta: entity.ecoValue,
        creditDelta: entity.creditValue,
        powerUpGranted: entity.powerUpType,
        feedback: {
          tone: 'mission',
          text: details.text,
          icon: details.icon,
          cue: 'powerup'
        }
      },
      'Power-up coletado.'
    )
  }

  return makeRulesResult(
    {
      playerDamage: entity.damage,
      feedback: {
        tone: 'negative',
        text: 'Contato perigoso na orbita.',
        icon: '💥',
        cue: 'damage'
      }
    },
    'Contato perigoso.'
  )
}

export function resolveEcoNaveProjectileHit(
  entity: EcoNaveEntity,
  classifierActive: boolean,
): EcoNaveRulesResult {
  if (entity.kind === 'hazard') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: entity.scoreValue,
        ecoDelta: entity.ecoValue,
        creditDelta: entity.creditValue,
        neutralizeDelta: 1,
        feedback: {
          tone: 'positive',
          text: `${entity.emoji} neutralizado. Residuos perigosos nao devem escapar.`,
          icon: '✨',
          cue: 'collect'
        }
      },
      'Residuo perigoso neutralizado.'
    )
  }

  if (entity.kind === 'recyclable') {
    if (classifierActive) {
      return makeRulesResult(
        {
          positive: true,
          scoreDelta: Math.round(entity.scoreValue * 0.9),
          ecoDelta: entity.ecoValue,
          creditDelta: entity.creditValue,
          collectDelta: 1,
          feedback: {
            tone: 'mission',
            text: `${entity.emoji} foi classificado pelo scanner e enviado para reciclagem.`,
            icon: '📷',
            cue: 'collect'
          }
        },
        'Reciclavel classificado com ajuda da camera.'
      )
    }

    return makeRulesResult(
      {
        scoreDelta: -14,
        ecoDelta: -10,
        feedback: {
          tone: 'negative',
          text: `${entity.emoji} podia ser recuperado. Atire apenas se o classificador estiver ativo.`,
          icon: '♻️',
          cue: 'error'
        }
      },
      'Reciclavel nao deve ser destruido.'
    )
  }

  if (entity.kind === 'satellite') {
    return makeRulesResult(
      {
        lostSatelliteDelta: 1,
        scoreDelta: -24,
        ecoDelta: -20,
        feedback: {
          tone: 'negative',
          text: `${entity.emoji} presta servico util. Preserve satelites e paineis solares.`,
          icon: '🛰️',
          cue: 'error'
        }
      },
      'Estrutura util nao deve ser destruida.'
    )
  }

  if (entity.kind === 'obstacle') {
    return makeRulesResult(
      {
        positive: false,
        removeEntity: false,
        feedback: {
          tone: 'warning',
          text: `${entity.emoji} nao e lixo. Use manobra ou pulso de limpeza.`,
          icon: '🪨',
          cue: 'alert'
        }
      },
      'Obstaculos naturais devem ser evitados.'
    )
  }

  if (entity.kind === 'boss') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: 12,
        ecoDelta: 4,
        bossDamage: 1,
        removeEntity: false,
        feedback: {
          tone: 'mission',
          text: 'Nucleo de sucata atingido. Continue limpando a orbita.',
          icon: '🎯',
          cue: 'boss'
        }
      },
      'Boss atingido.'
    )
  }

  return makeRulesResult(
    {
      removeEntity: false,
      feedback: {
        tone: 'warning',
        text: 'Esse alvo nao deve receber disparo agora.',
        icon: '⚠️',
        cue: 'alert'
      }
    },
    'Alvo indevido.'
  )
}

export function resolveEcoNavePulseHit(entity: EcoNaveEntity): EcoNaveRulesResult {
  if (entity.kind === 'hazard' || entity.kind === 'obstacle') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: entity.kind === 'hazard' ? entity.scoreValue : 18,
        ecoDelta: entity.kind === 'hazard' ? entity.ecoValue : 8,
        creditDelta: entity.kind === 'hazard' ? entity.creditValue : 3,
        neutralizeDelta: entity.kind === 'hazard' ? 1 : 0,
        feedback: {
          tone: 'mission',
          text: 'Pulso de limpeza abriu espaco seguro na rota orbital.',
          icon: '💥',
          cue: 'pulse'
        }
      },
      'Pulso de limpeza acionado.'
    )
  }

  if (entity.kind === 'boss') {
    return makeRulesResult(
      {
        positive: true,
        scoreDelta: 20,
        ecoDelta: 8,
        bossDamage: 3,
        removeEntity: false,
        feedback: {
          tone: 'mission',
          text: 'Pulso maximo acertou o monstro de sucata.',
          icon: '💥',
          cue: 'boss'
        }
      },
      'Boss atingido pelo pulso.'
    )
  }

  return makeRulesResult(
    {
      removeEntity: false,
      feedback: {
        tone: 'warning',
        text: 'O pulso deve ser guardado para ameacas reais.',
        icon: '⚠️',
        cue: 'alert'
      }
    },
    'Pulso reservado para ameacas.'
  )
}
