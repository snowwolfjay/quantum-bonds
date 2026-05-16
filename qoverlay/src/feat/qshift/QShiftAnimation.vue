<template>
  <div ref="container" class="qshift-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let mainParticle: THREE.Mesh
let trailLine: THREE.Line
let curve: THREE.CatmullRomCurve3
let cloudParticles: THREE.Points
let humanParticles: THREE.Points
let animationId: number

// ===== 参数 =====
let t = 0
const trailPoints: THREE.Vector3[] = []
const TRAIL_LENGTH = 80
const PARTICLE_COUNT = 1500
const CLOUD_PARTICLE_COUNT = 600

// ===== 初始化 =====
onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
  window.removeEventListener('resize', onResize)
})

// ===== 初始化场景 =====
function init() {
  if (!container.value) return
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

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
  createCloudParticles()
  createHumanParticles()

  window.addEventListener('resize', onResize)
}

// ===== 分镜路径 =====
function createPath() {
  const points = [
    new THREE.Vector3(-2, 0, 0),    // 人A位置
    new THREE.Vector3(-1, 0.2, 0),  // 呼气起点
    new THREE.Vector3(0, 0.5, 0),   // 上升过程
    new THREE.Vector3(1, 1, 0),     // 云层位置
    new THREE.Vector3(2, 0.8, 0),   // 云层扩散
    new THREE.Vector3(3, 0.5, 0),   // 风散
    new THREE.Vector3(2, 0, 0),     // 人B位置
    new THREE.Vector3(1, -0.2, 0),  // 吸入
    new THREE.Vector3(0, 0, 0),     // 中间
    new THREE.Vector3(-1, 0.2, 0),  // 回到呼气起点
  ]

  curve = new THREE.CatmullRomCurve3(points)
}

// ===== 主粒子（淡红色光点） =====
function createMainParticle() {
  const geometry = new THREE.SphereGeometry(0.08, 20, 20)
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6666,
    transparent: true,
    opacity: 0.8
  })

  mainParticle = new THREE.Mesh(geometry, material)
  scene.add(mainParticle)
}

// ===== 拖尾 =====
function createTrail() {
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.LineBasicMaterial({
    color: 0xff6666,
    transparent: true,
    opacity: 0.6
  })

  trailLine = new THREE.Line(geometry, material)
  scene.add(trailLine)
}

// ===== 背景粒子 =====
let bgGeometry: THREE.BufferGeometry

function createBackgroundParticles() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5
  }

  bgGeometry = new THREE.BufferGeometry()
  bgGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x333333,
    transparent: true,
    opacity: 0.6
  })

  const points = new THREE.Points(bgGeometry, material)
  scene.add(points)
}

// ===== 云层粒子 =====
function createCloudParticles() {
  const positions = new Float32Array(CLOUD_PARTICLE_COUNT * 3)

  for (let i = 0; i < CLOUD_PARTICLE_COUNT; i++) {
    const radius = 1 + Math.random() * 0.5
    const angle = Math.random() * Math.PI * 2
    const height = 0.8 + Math.random() * 0.4
    
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x444444,
    transparent: true,
    opacity: 0.5
  })

  cloudParticles = new THREE.Points(geometry, material)
  cloudParticles.position.set(1, 0, 0)
  scene.add(cloudParticles)
}

// ===== 人体粒子 =====
function createHumanParticles() {
  const positions = []
  
  // 人A的轮廓
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI
    const x = -2
    const y = Math.sin(angle) * 1.5 - 0.5
    const z = Math.cos(angle) * 0.3
    positions.push(x, y, z)
  }
  
  // 人B的轮廓
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI
    const x = 2
    const y = Math.sin(angle) * 1.5 - 0.5
    const z = Math.cos(angle) * 0.3
    positions.push(x, y, z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  )

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x555555,
    transparent: true,
    opacity: 0.7
  })

  humanParticles = new THREE.Points(geometry, material)
  scene.add(humanParticles)
}

// ===== 动画 =====
function animate() {
  animationId = requestAnimationFrame(animate)

  updateMainParticle()
  updateTrail()
  updateCamera()
  updateBackground()
  updateCloudParticles()

  renderer.render(scene, camera)
}

// ===== 主粒子移动 =====
function updateMainParticle() {
  // 呼吸节奏（慢→快→慢）
  t += 0.001 + Math.sin(t * Math.PI * 2) * 0.0005
  if (t > 1) t = 0

  const pos = curve.getPointAt(t)
  mainParticle.position.copy(pos)

  // 呼吸脉冲
  const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2
  mainParticle.scale.set(scale, scale, scale)

  // 粒子闪烁效果
  const material = mainParticle.material as THREE.MeshBasicMaterial
  material.opacity = 0.6 + Math.sin(Date.now() * 0.01) * 0.2
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

  const target = pos.clone().add(new THREE.Vector3(0.5, 0.5, 3))

  camera.position.lerp(target, 0.08)
  camera.lookAt(pos)
}

// ===== 环境粒子 =====
function updateBackground() {
  const positions = bgGeometry.attributes.position.array

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 1] += Math.sin(Date.now() * 0.0005 + i) * 0.0005
    if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5
  }

  bgGeometry.attributes.position.needsUpdate = true
}

// ===== 云层粒子 =====
function updateCloudParticles() {
  if (cloudParticles) {
    const positions = cloudParticles.geometry.attributes.position.array
    
    for (let i = 0; i < CLOUD_PARTICLE_COUNT; i++) {
      positions[i * 3] += Math.sin(Date.now() * 0.0003 + i) * 0.0005
      positions[i * 3 + 2] += Math.cos(Date.now() * 0.0002 + i) * 0.0003
    }
    
    cloudParticles.geometry.attributes.position.needsUpdate = true
  }
}

// ===== 自适应 =====
function onResize() {
  if (!container.value) return
  
  const w = container.value.clientWidth
  const h = container.value.clientHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
</script>

<style scoped>
.qshift-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>