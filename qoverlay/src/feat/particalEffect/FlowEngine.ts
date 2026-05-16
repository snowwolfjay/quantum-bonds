import * as THREE from 'three'
import { FlowNode, FlowSegment } from './types'

export class FlowEngine {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera

  nodes: FlowNode[] = []
  segments: FlowSegment[] = []

  currentIndex = 0
  t = 0

  mainParticle: THREE.Mesh
  trailPoints: THREE.Vector3[] = []
  trailLine: THREE.Line

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene
    this.camera = camera

    this.mainParticle = this.createMainParticle()
    this.trailLine = this.createTrail()
  }

  // ===== 创建节点 =====
  setNodes(nodes: FlowNode[]) {
    this.nodes = nodes
    this.buildSegments()
  }

  // ===== 构建路径 =====
  private buildSegments() {
    this.segments = []

    for (let i = 0; i < this.nodes.length - 1; i++) {
      const from = this.nodes[i]
      const to = this.nodes[i + 1]

      const mid = from.position.clone().lerp(to.position, 0.5)
      mid.y += 1 // 提升弧线

      const curve = new THREE.CatmullRomCurve3([
        from.position,
        mid,
        to.position
      ])

      this.segments.push({ from, to, curve })
    }
  }

  // ===== 主粒子 =====
  private createMainParticle() {
    const geo = new THREE.SphereGeometry(0.06, 16, 16)
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const mesh = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
    return mesh
  }

  // ===== 拖尾 =====
  private createTrail() {
    const geo = new THREE.BufferGeometry()
    const mat = new THREE.LineBasicMaterial({ color: 0x00ffff })
    const line = new THREE.Line(geo, mat)
    this.scene.add(line)
    return line
  }

  // ===== 更新 =====
  update(delta: number) {
    if (!this.segments.length) return

    const segment = this.segments[this.currentIndex]

    // 节奏（呼吸）
    this.t += delta * 0.2
    if (this.t >= 1) {
      this.t = 0
      this.currentIndex = (this.currentIndex + 1) % this.segments.length
    }

    const pos = segment.curve.getPointAt(this.t)
    this.mainParticle.position.copy(pos)

    // this.updateTrail(pos)
    this.updateCamera(pos)
  }

  // ===== 拖尾 =====
  private updateTrail(pos: THREE.Vector3) {
    this.trailPoints.push(pos.clone())
    if (this.trailPoints.length > 100) {
      this.trailPoints.shift()
    }

    this.trailLine.geometry.setFromPoints(this.trailPoints)
  }

  // ===== 镜头 =====
  private updateCamera(pos: THREE.Vector3) {
    const target = pos.clone().add(new THREE.Vector3(0.5, 0.5, 2))
    this.camera.position.lerp(target, 0.05)
    this.camera.lookAt(pos)
  }
}