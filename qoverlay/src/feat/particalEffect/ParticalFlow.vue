<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { FlowEngine } from './FlowEngine'
import type { FlowNode } from './types'

const container = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let engine: FlowEngine

let lastTime = 0
let animationId: number

onMounted(() => {
  init()
  animate(0)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
})

function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000010)

  camera = new THREE.PerspectiveCamera(
    60,
    container.value!.clientWidth / container.value!.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(
    container.value!.clientWidth,
    container.value!.clientHeight
  )

  container.value!.appendChild(renderer.domElement)

  engine = new FlowEngine(scene, camera)

  setupNodes()

  window.addEventListener('resize', onResize)
}

function setupNodes() {
  const nodes: FlowNode[] = [
    {
      id: 'humanA',
      type: 'human',
      position: new THREE.Vector3(-3, 0, 0)
    },
    {
      id: 'grass',
      type: 'grass',
      position: new THREE.Vector3(0, 0.5, 0)
    },
    {
      id: 'tree',
      type: 'tree',
      position: new THREE.Vector3(1.5, 1.5, 0)
    },
    {
      id: 'cloud',
      type: 'cloud',
      position: new THREE.Vector3(2.5, 2.5, 0)
    },
    {
      id: 'humanB',
      type: 'human',
      position: new THREE.Vector3(3.5, 0, 0)
    }
  ]

  engine.setNodes(nodes)
}

function animate(time: number) {
  animationId = requestAnimationFrame(animate)

  const delta = (time - lastTime) / 1000
  lastTime = time

  engine.update(delta)

  renderer.render(scene, camera)
}

function onResize() {
  const w = container.value!.clientWidth
  const h = container.value!.clientHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>