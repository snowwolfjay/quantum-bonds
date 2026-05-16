<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref(null)

let scene, camera, renderer
let mainParticle, trailLine
let curve
let animationId

// ===== 参数 =====
let t = 0
const trailPoints = []
const TRAIL_LENGTH = 120

// ===== 初始化 =====
onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
})

// ===== 初始化场景 =====
function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000010)

  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  )

  container.value.appendChild(renderer.domElement)

  createPath()
  createMainParticle()
  createTrail()
  createBackgroundParticles()

  window.addEventListener('resize', onResize)
}

// ===== 路径 =====
function createPath() {
  const points = [
    new THREE.Vector3(-3, 0, 0),   // 人A
    new THREE.Vector3(-1, 1, 0),   // 呼气
    new THREE.Vector3(0, 0.5, 0),  // 草
    new THREE.Vector3(1, 1.5, 0),  // 树
    new THREE.Vector3(2, 2.5, 0),  // 云
    new THREE.Vector3(3, 0, 0)     // 人B
  ]

  curve = new THREE.CatmullRomCurve3(points)
}

// ===== 主粒子 =====
function createMainParticle() {
  const geometry = new THREE.SphereGeometry(0.06, 16, 16)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff
  })

  mainParticle = new THREE.Mesh(geometry, material)
  scene.add(mainParticle)
}

// ===== 拖尾 =====
function createTrail() {
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
  })

  trailLine = new THREE.Line(geometry, material)
  scene.add(trailLine)
}

// ===== 环境粒子 =====
let bgGeometry
const PARTICLE_COUNT = 800

function createBackgroundParticles() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  bgGeometry = new THREE.BufferGeometry()
  bgGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x88ccff
  })

  const points = new THREE.Points(bgGeometry, material)
  scene.add(points)
}

// ===== 动画 =====
function animate() {
  animationId = requestAnimationFrame(animate)

  updateMainParticle()
  updateTrail()
  updateCamera()
  updateBackground()

  renderer.render(scene, camera)
}

// ===== 主粒子移动 =====
function updateMainParticle() {
  // 呼吸节奏（慢→快→慢）
  t += 0.0008 + Math.sin(t * Math.PI) * 0.0005
  if (t > 1) t = 0

  const pos = curve.getPointAt(t)
  mainParticle.position.copy(pos)

  // 呼吸脉冲
  const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1
  mainParticle.scale.set(scale, scale, scale)
}

// ===== 拖尾 =====
function updateTrail() {
  trailPoints.push(mainParticle.position.clone())
  if (trailPoints.length > TRAIL_LENGTH) {
    trailPoints.shift()
  }

  trailLine.geometry.setFromPoints(trailPoints)
}

// ===== 镜头跟随 =====
function updateCamera() {
  const pos = mainParticle.position

  const target = pos.clone().add(new THREE.Vector3(0.5, 0.5, 2))

  camera.position.lerp(target, 0.05)
  camera.lookAt(pos)
}

// ===== 环境粒子 =====
function updateBackground() {
  const positions = bgGeometry.attributes.position.array

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0003
  }

  bgGeometry.attributes.position.needsUpdate = true
}

// ===== 自适应 =====
function onResize() {
  const w = container.value.clientWidth
  const h = container.value.clientHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>