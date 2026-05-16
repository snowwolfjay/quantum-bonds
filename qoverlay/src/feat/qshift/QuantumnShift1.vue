<template>
  <div ref="container" class="particle-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, points: THREE.Points
let positions: Float32Array, targets: Float32Array, velocities: Float32Array
let frameId: number

const PARTICLE_COUNT = 2000
let phase = 0
let phaseTime = 0

// 👉 阶段时长（秒）
const PHASE_DURATION = [2, 3, 3, 2, 3, 2]

onMounted(() => {
  setTimeout(() => {
    init()
  animate()
  }, 100);
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  renderer.dispose()
})

function init() {
  scene = new THREE.Scene()
 const box = container.value
 if (!box) {
  return
 }
  camera = new THREE.PerspectiveCamera(
    60,
    box.clientWidth / box.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 10

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(box.clientWidth, box.clientHeight)
  box.appendChild(renderer.domElement)

  // 粒子数据
  positions = new Float32Array(PARTICLE_COUNT * 3)
  targets = new Float32Array(PARTICLE_COUNT * 3)
  velocities = new Float32Array(PARTICLE_COUNT * 3)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xff8888,
    transparent: true,
    opacity: 0.9
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

function animate() {
  frameId = requestAnimationFrame(animate)

  updatePhase()
  updateParticles()

  renderer.render(scene, camera)
}

function updatePhase() {
  phaseTime += 0.016

  if (phaseTime > PHASE_DURATION[phase]) {
    phaseTime = 0
    phase = (phase + 1) % 6
    setTargets()
  }
}

function setTargets() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3

    if (phase === 0) {
      // 从口中喷出
      targets[i3] = Math.random() * 2 - 1
      targets[i3 + 1] = Math.random() * 0.5
      targets[i3 + 2] = 0
    }

    if (phase === 1) {
      // 上升漂移
      targets[i3] = (Math.random() - 0.5) * 4
      targets[i3 + 1] = Math.random() * 3
    }

    if (phase === 2) {
      // 云聚集
      const angle = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random()
      targets[i3] = Math.cos(angle) * r
      targets[i3 + 1] = 2 + Math.sin(angle) * r
    }

    if (phase === 3) {
      // 云扩散
      targets[i3] *= 1.5
      targets[i3 + 1] += Math.random() * 1
    }

    if (phase === 4) {
      // 流向另一个人
      targets[i3] = 3 + Math.random()
      targets[i3 + 1] = Math.random() * 1
    }

    if (phase === 5) {
      // 吸入口中
      targets[i3] = 4
      targets[i3 + 1] = 0
    }
  }
}

function updateParticles() {
  const pos = points.geometry.attributes.position.array

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3

    pos[i3] += (targets[i3] - pos[i3]) * 0.02
    pos[i3 + 1] += (targets[i3 + 1] - pos[i3 + 1]) * 0.02
    pos[i3 + 2] += (targets[i3 + 2] - pos[i3 + 2]) * 0.02
  }

  points.geometry.attributes.position.needsUpdate = true
}
</script>

<style>
.particle-container {
  width: 100%;
  height: 100%;
  background: black;
}
</style>