<template>
  <div ref="rootRef" class="econave-stage-canvas" :class="{ immersive }">
    <div v-if="isBooting" class="canvas-loading">Preparando a orbita...</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Application, Container, Graphics, Text } from 'pixi.js'

import { getEcoNaveStage } from '@/engine/econave/data/stages'
import type {
  EcoNaveEntity,
  EcoNaveParticle,
  EcoNaveProjectile,
  EcoNaveRenderQuality,
  EcoNaveRuntimeState,
  EcoNaveStageId
} from '@/types/econave'

interface DisplayNode {
  container: Container
  halo: Graphics
  label: Text
}

const props = withDefaults(
  defineProps<{
    runtimeState: EcoNaveRuntimeState | null
    stageId: EcoNaveStageId
    quality?: EcoNaveRenderQuality
    immersive?: boolean
  }>(),
  {
    quality: 'high',
    immersive: false
  },
)

const rootRef = ref<HTMLDivElement | null>(null)
const isBooting = ref(true)

let app: Application | null = null
let resizeObserver: ResizeObserver | null = null

const backgroundLayer = new Graphics()
const detailLayer = new Graphics()
const parallaxLayer = new Container()
const gameplayLayer = new Container()
const particleLayer = new Container()
const playerNode = new Container()
const playerGlow = new Graphics()
const playerHull = new Graphics()
const playerCockpit = new Graphics()

const starNodes: Graphics[] = []
const entityNodes = new Map<string, DisplayNode>()
const projectileNodes = new Map<string, Graphics>()
const particleNodes = new Map<string, Graphics>()

function getActiveStage() {
  return props.runtimeState?.stageConfig ?? getEcoNaveStage(props.stageId)
}

function getRendererSize() {
  if (!app) {
    return { width: 1, height: 1 }
  }

  return {
    width: app.renderer.width,
    height: app.renderer.height
  }
}

function toCanvasPosition(x: number, y: number) {
  const { width, height } = getRendererSize()

  return {
    x: x * width,
    y: y * height
  }
}

function createLabelNode(emoji: string, fontSize: number) {
  return new Text({
    text: emoji,
    style: {
      fontFamily: 'Avenir Next Rounded, Nunito, sans-serif',
      fontSize,
      fill: 0xffffff,
      align: 'center'
    }
  })
}

function rebuildStars() {
  parallaxLayer.removeChildren()
  starNodes.length = 0

  const count = props.quality === 'eco' ? 14 : props.quality === 'balanced' ? 22 : 32

  for (let index = 0; index < count; index += 1) {
    const star = new Graphics()
    star.circle(0, 0, 2.2 + Math.random() * 1.8).fill({
      color: index % 4 === 0 ? 0xfef3c7 : 0xe0f2fe,
      alpha: 0.82
    })
    star.alpha = 0.5 + Math.random() * 0.45
    star.eventMode = 'none'
    starNodes.push(star)
    parallaxLayer.addChild(star)
  }
}

function updateBackground() {
  const stage = getActiveStage()
  if (!stage) {
    return
  }

  const { width, height } = getRendererSize()
  const radius = props.immersive ? 24 : 34
  backgroundLayer.clear()
  backgroundLayer.roundRect(0, 0, width, height, radius).fill({ color: stage.skyTop })
  backgroundLayer.roundRect(0, height * 0.36, width, height * 0.64, 0).fill({
    color: stage.skyBottom,
    alpha: 0.78
  })
  backgroundLayer.roundRect(width * 0.08, height * 0.1, width * 0.84, height * 0.18, 90).fill({
    color: 0xffffff,
    alpha: 0.07
  })

  detailLayer.clear()
  detailLayer.circle(width * 0.18, height * 0.78, width * 0.34).stroke({
    color: 0xffffff,
    alpha: 0.08,
    width: 2
  })
  detailLayer.circle(width * 0.82, height * 0.22, width * 0.18).fill({
    color: 0xffffff,
    alpha: 0.05
  })
  detailLayer.circle(width * 0.82, height * 0.22, width * 0.23).stroke({
    color: 0xffffff,
    alpha: 0.06,
    width: 2
  })
  detailLayer.roundRect(width * 0.08, height * 0.62, width * 0.84, height * 0.22, 28).stroke({
    color: 0xffffff,
    alpha: 0.05,
    width: 2
  })
}

function updateStars() {
  const state = props.runtimeState
  const { width, height } = getRendererSize()
  const scrollOffset = state?.backgroundOffset ?? 0

  starNodes.forEach((star, index) => {
    const parallax = 0.15 + (index % 5) * 0.05
    const xSeed = ((index * 97) % 100) / 100
    const ySeed = ((index * 37) % 100) / 100
    star.x = 24 + xSeed * (width - 48)
    star.y = ((ySeed + scrollOffset * parallax) % 1.18) * height - 40
  })
}

function drawPlayer() {
  playerGlow.clear()
  playerHull.clear()
  playerCockpit.clear()

  playerGlow.circle(0, 0, 42).fill({ color: 0x38bdf8, alpha: 0.18 })
  playerHull
    .moveTo(0, -36)
    .lineTo(26, 28)
    .lineTo(0, 18)
    .lineTo(-26, 28)
    .closePath()
    .fill({ color: 0xeff6ff })
  playerHull.roundRect(-10, 4, 20, 24, 10).fill({ color: 0x0f172a })
  playerCockpit.roundRect(-9, -14, 18, 18, 9).fill({ color: 0x38bdf8 })

  playerNode.addChild(playerGlow, playerHull, playerCockpit)
}

function createDisplayNode(entity: EcoNaveEntity) {
  const container = new Container()
  const halo = new Graphics()
  const label = createLabelNode(entity.emoji, entity.kind === 'boss' ? 72 : 34)
  label.anchor.set(0.5)
  container.addChild(halo, label)
  gameplayLayer.addChild(container)
  const node = { container, halo, label }
  entityNodes.set(entity.id, node)
  return node
}

function updateEntityNode(entity: EcoNaveEntity) {
  const node = entityNodes.get(entity.id) ?? createDisplayNode(entity)
  const { x, y } = toCanvasPosition(entity.x, entity.y)
  node.container.x = x
  node.container.y = y
  node.container.rotation = entity.angle * 0.1

  node.halo.clear()
  node.halo.circle(0, 0, entity.kind === 'boss' ? 92 : entity.radius * getRendererSize().width * 0.88).fill({
    color: entity.color,
    alpha: entity.kind === 'satellite' ? 0.16 : 0.26
  })
  node.label.text = entity.emoji
  node.label.style.fontSize = entity.kind === 'boss' ? 76 : 30 + entity.radius * 110
  node.container.alpha = entity.kind === 'satellite' ? 0.96 : 1
}

function cleanupEntityNodes(activeIds: string[]) {
  entityNodes.forEach((node, key) => {
    if (activeIds.includes(key)) {
      return
    }

    node.container.destroy({ children: true })
    entityNodes.delete(key)
  })
}

function updateProjectileNode(projectile: EcoNaveProjectile) {
  const node =
    projectileNodes.get(projectile.id) ??
    (() => {
      const graphics = new Graphics()
      projectileNodes.set(projectile.id, graphics)
      gameplayLayer.addChild(graphics)
      return graphics
    })()

  const position = toCanvasPosition(projectile.x, projectile.y)
  node.clear()
  node.circle(0, 0, 7).fill({ color: 0x93c5fd })
  node.x = position.x
  node.y = position.y
}

function cleanupProjectileNodes(activeIds: string[]) {
  projectileNodes.forEach((node, key) => {
    if (activeIds.includes(key)) {
      return
    }

    node.destroy()
    projectileNodes.delete(key)
  })
}

function updateParticleNode(particle: EcoNaveParticle) {
  const node =
    particleNodes.get(particle.id) ??
    (() => {
      const graphics = new Graphics()
      particleNodes.set(particle.id, graphics)
      particleLayer.addChild(graphics)
      return graphics
    })()

  const position = toCanvasPosition(particle.x, particle.y)
  node.clear()
  node.circle(0, 0, particle.size).fill({ color: particle.color, alpha: particle.alpha })
  node.x = position.x
  node.y = position.y
  node.alpha = particle.alpha
}

function cleanupParticleNodes(activeIds: string[]) {
  particleNodes.forEach((node, key) => {
    if (activeIds.includes(key)) {
      return
    }

    node.destroy()
    particleNodes.delete(key)
  })
}

function renderFrame() {
  if (!app) {
    return
  }

  updateBackground()
  updateStars()

  const runtime = props.runtimeState
  if (!runtime) {
    const previewPosition = toCanvasPosition(0.5, 0.76)
    playerNode.x = previewPosition.x
    playerNode.y = previewPosition.y
    gameplayLayer.position.set(0, 0)
    cleanupEntityNodes([])
    cleanupProjectileNodes([])
    cleanupParticleNodes([])
    return
  }

  const playerPosition = toCanvasPosition(runtime.player.x, runtime.player.y)
  playerNode.x = playerPosition.x
  playerNode.y = playerPosition.y

  if (runtime.cameraShakeMs > 0) {
    gameplayLayer.position.set(randomBetween(-4, 4), randomBetween(-4, 4))
  } else {
    gameplayLayer.position.set(0, 0)
  }

  runtime.entities.forEach((entity) => updateEntityNode(entity))
  cleanupEntityNodes(runtime.entities.map((entity) => entity.id))

  runtime.projectiles.forEach((projectile) => updateProjectileNode(projectile))
  cleanupProjectileNodes(runtime.projectiles.map((projectile) => projectile.id))

  runtime.particles.forEach((particle) => updateParticleNode(particle))
  cleanupParticleNodes(runtime.particles.map((particle) => particle.id))
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

async function bootstrapCanvas() {
  if (!rootRef.value) {
    return
  }

  app = new Application()
  await app.init({
    resizeTo: rootRef.value,
    backgroundAlpha: 0,
    antialias: props.quality !== 'eco',
    resolution: Math.min(window.devicePixelRatio || 1, props.quality === 'high' ? 2 : 1.5)
  })

  rootRef.value.appendChild(app.canvas)
  rootRef.value.style.position = 'relative'

  playerNode.eventMode = 'none'
  gameplayLayer.eventMode = 'none'
  particleLayer.eventMode = 'none'
  parallaxLayer.eventMode = 'none'

  drawPlayer()
  rebuildStars()

  app.stage.addChild(backgroundLayer, detailLayer, parallaxLayer, gameplayLayer, particleLayer, playerNode)
  app.ticker.add(renderFrame)

  resizeObserver = new ResizeObserver(() => {
    renderFrame()
  })
  resizeObserver.observe(rootRef.value)

  isBooting.value = false
  renderFrame()
}

function teardownCanvas() {
  resizeObserver?.disconnect()
  resizeObserver = null

  entityNodes.forEach((node) => node.container.destroy({ children: true }))
  projectileNodes.forEach((node) => node.destroy())
  particleNodes.forEach((node) => node.destroy())
  entityNodes.clear()
  projectileNodes.clear()
  particleNodes.clear()
  starNodes.length = 0

  if (app) {
    app.ticker.remove(renderFrame)
    app.destroy(true)
    app = null
  }
}

watch(
  () => props.quality,
  () => {
    if (!app) {
      return
    }

    rebuildStars()
    renderFrame()
  }
)

watch(
  () => props.stageId,
  () => {
    renderFrame()
  }
)

onMounted(() => {
  void bootstrapCanvas()
})

onBeforeUnmount(() => {
  teardownCanvas()
})
</script>

<style scoped>
.econave-stage-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
}

.econave-stage-canvas.immersive {
  border-radius: inherit;
}

.canvas-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
}
</style>
