<template>
  <div ref="container" class="particle-bg" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)
let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    points: THREE.Points,
    animationFrame: number

// 目标形状的粒子位置（可扩展）
let currentTarget = 0
const targets: THREE.BufferAttribute[] = []

const shapes = ['cloud', 'tree', 'human', 'sphere', 'random'] as const

function createRandomPositions(count: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 20
    positions[i + 2] = (Math.random() - 0.5) * 20
  }
  return new THREE.BufferAttribute(positions, 3)
}

function createCloudPositions(count: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 3 + Math.random() * 2
    positions[i]     = r * Math.sin(phi) * Math.cos(theta)
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6 + (Math.random() - 0.5) * 1
    positions[i + 2] = r * Math.cos(phi)
  }
  return new THREE.BufferAttribute(positions, 3)
}

function createTreePositions(count: number) {
  const positions = new Float32Array(count * 3)
  // 树干
  const trunk = Math.floor(count * 0.2)
  for (let i = 0; i < trunk * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 0.8
    positions[i + 1] = Math.random() * 4 - 2
    positions[i + 2] = (Math.random() - 0.5) * 0.8
  }
  // 树冠
  for (let i = trunk * 3; i < count * 3; i += 3) {
    const y = Math.random() * 4
    const radius = (5 - y) * 1.2
    const angle = Math.random() * Math.PI * 2
    positions[i]     = Math.cos(angle) * radius * (Math.random() * 0.6 + 0.7)
    positions[i + 1] = y - 1
    positions[i + 2] = Math.sin(angle) * radius * (Math.random() * 0.6 + 0.7)
  }
  return new THREE.BufferAttribute(positions, 3)
}

function createHumanPositions(count: number) {
  const positions = new Float32Array(count * 3)
  // 头
  const head = Math.floor(count * 0.15)
  for (let i = 0; i < head * 3; i += 3) {
    const r = 1.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i]     = r * Math.sin(phi) * Math.cos(theta) * 0.8
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8 + 4
    positions[i + 2] = r * Math.cos(phi)
  }
  // 身体 + 四肢（简化）
  for (let i = head * 3; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 1.5
    positions[i + 1] = Math.random() * 4 - 1
    positions[i + 2] = (Math.random() - 0.5) * 0.8
  }
  return new THREE.BufferAttribute(positions, 3)
}

function init() {
  const width = window.innerWidth
  const height = window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
  camera.position.z = 12

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value?.appendChild(renderer.domElement)

  // 粒子材质（发光点）
  const particleCount = 8000
  const geometry = new THREE.BufferGeometry()

  const positions = createRandomPositions(particleCount)
  geometry.setAttribute('position', positions)

  const colors = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i += 3) {
    colors[i]     = 0.6 + Math.random() * 0.4   // R
    colors[i + 1] = 0.8 + Math.random() * 0.2   // G (偏青绿/白)
    colors[i + 2] = 1.0                         // B
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthTest: false,
    blending: THREE.AdditiveBlending
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  // 准备不同目标形状
  targets.push(createCloudPositions(particleCount))
  targets.push(createTreePositions(particleCount))
  targets.push(createHumanPositions(particleCount))
  targets.push(new THREE.SphereGeometry(5, 64, 64).attributes.position as THREE.BufferAttribute)
  targets.push(createRandomPositions(particleCount))

  // 窗口自适应
  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function morphToNextShape() {
  currentTarget = (currentTarget + 1) % targets.length
  const targetPos = targets[currentTarget]

  const currentPos = points.geometry.attributes.position as THREE.BufferAttribute
  const duration = 4000 // 4秒过渡

  const startTime = Date.now()

  function animateMorph() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // easeInOut
    const t = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

    for (let i = 0; i < currentPos.count * 3; i++) {
      currentPos.array[i] = currentPos.array[i] * (1 - t) + targetPos.array[i] * t
    }
    currentPos.needsUpdate = true

    if (progress < 1) {
      setTimeout(animateMorph, 16)
    } else {
      // 过渡完成后随机漂浮一会儿再变下一个
      setTimeout(morphToNextShape, 3000 + Math.random() * 4000)
    }
  }

  animateMorph()
}

// 持续轻微随机运动 + 旋转
function animate() {
  animationFrame = requestAnimationFrame(animate)

  if (points) {
    points.rotation.y += 0.0003 // 缓慢整体旋转
    // 轻微扰动
    const pos = points.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 1; i < pos.count * 3; i += 3) {
      pos.array[i] += Math.sin(Date.now() * 0.001 + i) * 0.0008
    }
    pos.needsUpdate = true
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
  // 首次延迟后开始变形
  setTimeout(morphToNextShape, 2000)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', onResize)
  if (renderer && container.value) {
    container.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<style scoped>
.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(circle at center, #0a1428 0%, #000 80%);
}
</style>