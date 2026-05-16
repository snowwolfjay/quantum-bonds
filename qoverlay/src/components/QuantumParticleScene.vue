<template>
  <div class="quantum-particle-scene" ref="container">
    <canvas ref="canvas" class="quantum-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null = null;
let geometry: THREE.BufferGeometry | null = null;
let silhouetteMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
let ghostMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
let haloMesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | null = null;
let animationFrameId: number | null = null;
let clock: THREE.Clock | null = null;
let shapeIndex = 0;
type ParticleState = 'gather' | 'hold' | 'scatter' | 'transition';
let state: ParticleState = 'gather';
let stateTimer = 0;
let targetPositions: Float32Array | null = null;
let shapeCanvas: HTMLCanvasElement | null = null;

const particleCount = 16000;
const shapes = ['head', 'tree', 'car'];
const shapeDurations: Record<ParticleState, number> = {
  gather: 10,
  hold: 4,
  scatter: 4,
  transition: 1.2,
};

const sizes = {
  gather: 1.1,
  scatter: 1.5,
};

const createParticleTexture = (): THREE.Texture => {
  const size = 128;
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = size;
  textureCanvas.height = size;
  const ctx = textureCanvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create particle texture');

  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.45);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.35, 'rgba(140,210,255,0.65)');
  gradient.addColorStop(1, 'rgba(110,100,255,0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.Texture(textureCanvas);
  texture.needsUpdate = true;
  return texture;
};

const createShapeCanvas = () => {
  shapeCanvas = document.createElement('canvas');
  shapeCanvas.width = 512;
  shapeCanvas.height = 512;
  return shapeCanvas;
};

const drawSilhouette = (shape: string, ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 12;
  ctx.shadowColor = 'rgba(77, 168, 255, 0.45)';
  ctx.shadowBlur = 24;

  const scale = Math.min(width, height) * 0.0012;

  const drawPath = (path: Path2D) => {
    ctx.fill(path);
    ctx.stroke(path);
  };

  if (shape === 'head') {
    const head = new Path2D();
    head.ellipse(0, -24, 110, 135, 0, 0, Math.PI * 2);
    head.moveTo(-76, 20);
    head.bezierCurveTo(-76, 48, -46, 96, 0, 96);
    head.bezierCurveTo(46, 96, 76, 50, 76, 22);
    head.closePath();
    drawPath(head);
    const ear = new Path2D();
    ear.moveTo(-96, -28);
    ear.bezierCurveTo(-118, -20, -118, 14, -96, 24);
    ear.moveTo(96, -30);
    ear.bezierCurveTo(118, -20, 118, 16, 96, 26);
    drawPath(ear);
  } else if (shape === 'tree') {
    const trunk = new Path2D();
    trunk.rect(-26, 36, 52, 90);
    drawPath(trunk);
    const canopy = new Path2D();
    canopy.moveTo(-150, 18);
    canopy.bezierCurveTo(-170, -68, -88, -142, 0, -150);
    canopy.bezierCurveTo(84, -148, 170, -70, 146, 14);
    canopy.bezierCurveTo(220, 18, 190, 105, 112, 108);
    canopy.bezierCurveTo(120, 148, 58, 150, 4, 124);
    canopy.bezierCurveTo(-55, 152, -126, 128, -136, 92);
    canopy.bezierCurveTo(-194, 80, -190, 32, -150, 18);
    drawPath(canopy);
  } else if (shape === 'car') {
    const body = new Path2D();
    body.moveTo(-170, 30);
    body.quadraticCurveTo(-136, -80, -30, -96);
    body.lineTo(88, -96);
    body.quadraticCurveTo(176, -92, 210, -18);
    body.quadraticCurveTo(230, 10, 210, 62);
    body.lineTo(170, 84);
    body.lineTo(-150, 84);
    body.closePath();
    drawPath(body);
    const wheelA = new Path2D();
    wheelA.arc(-100, 102, 28, 0, Math.PI * 2);
    const wheelB = new Path2D();
    wheelB.arc(90, 102, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#0b1532';
    ctx.fill(wheelA);
    ctx.fill(wheelB);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 6;
    ctx.stroke(wheelA);
    ctx.stroke(wheelB);
  }

  ctx.restore();
};

const sampleSilhouette = (shape: string) => {
  if (!shapeCanvas) createShapeCanvas();
  if (!shapeCanvas) return [];
  const ctx = shapeCanvas.getContext('2d');
  if (!ctx) return [];
  drawSilhouette(shape, ctx, shapeCanvas.width, shapeCanvas.height);
  const image = ctx.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height);
  const points: Array<{ x: number; y: number; z: number }> = [];
  const step = 4;
  for (let y = 0; y < shapeCanvas.height; y += step) {
    for (let x = 0; x < shapeCanvas.width; x += step) {
      const index = (y * shapeCanvas.width + x) * 4;
      if (image.data[index + 3] > 80) {
        const nx = (x / shapeCanvas.width - 0.5) * 500;
        const ny = (0.5 - y / shapeCanvas.height) * 380;
        const nz = (Math.random() - 0.5) * 16;
        points.push({ x: nx, y: ny, z: nz });
      }
    }
  }
  return points;
};

const initializePoints = () => {
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const current = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 180 + Math.random() * 220;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    current[i * 3] = x;
    current[i * 3 + 1] = y;
    current[i * 3 + 2] = z;
    const hue = 0.62 + Math.random() * 0.18;
    const color = new THREE.Color().setHSL(hue, 0.9, 0.65);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('currentPosition', new THREE.BufferAttribute(current, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
};

const createSilhouetteTexture = (shape: string, opacity = 1) => {
  if (!shapeCanvas) createShapeCanvas();
  if (!shapeCanvas) throw new Error('Failed to create shape canvas');
  const ctx = shapeCanvas.getContext('2d');
  if (!ctx) throw new Error('Unable to get shape canvas context');
  ctx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
  ctx.globalCompositeOperation = 'source-over';
  drawSilhouette(shape, ctx, shapeCanvas.width, shapeCanvas.height);
  ctx.globalCompositeOperation = 'lighter';
  const gradient = ctx.createRadialGradient(
    shapeCanvas.width / 2,
    shapeCanvas.height / 2,
    shapeCanvas.width * 0.05,
    shapeCanvas.width / 2,
    shapeCanvas.height / 2,
    shapeCanvas.width * 0.6
  );
  gradient.addColorStop(0, `rgba(141, 216, 255, ${0.35 * opacity})`);
  gradient.addColorStop(0.4, `rgba(16, 38, 82, ${0.05 * opacity})`);
  gradient.addColorStop(1, 'rgba(16, 38, 82, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, shapeCanvas.width, shapeCanvas.height);
  const texture = new THREE.Texture(shapeCanvas);
  texture.needsUpdate = true;
  texture.flipY = false;
  return texture;
};

const buildShapePlane = (texture: THREE.Texture, width: number, height: number) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    toneMapped: false,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
};

const updateTargets = (shape: string) => {
  const silhouette = sampleSilhouette(shape);
  const targetArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const sample = silhouette[Math.floor(Math.random() * silhouette.length)] || { x: 0, y: 0, z: 0 };
    targetArray[i * 3] = sample.x + (Math.random() - 0.5) * 18;
    targetArray[i * 3 + 1] = sample.y + (Math.random() - 0.5) * 18;
    targetArray[i * 3 + 2] = sample.z;
  }
  targetPositions = targetArray;
};

const resizeRenderer = () => {
  if (!renderer || !camera || !container?.value) return;
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

const setState = (next: ParticleState) => {
  state = next;
  stateTimer = 0;
  if (next === 'gather') {
    shapeIndex = (shapeIndex + 1) % shapes.length;
    updateTargets(shapes[shapeIndex]);
    if (silhouetteMesh && ghostMesh) {
      const nextIndex = (shapeIndex + 1) % shapes.length;
      silhouetteMesh.material.map = createSilhouetteTexture(shapes[shapeIndex], 1);
      ghostMesh.material.map = createSilhouetteTexture(shapes[nextIndex], 0.38);
      silhouetteMesh.material.needsUpdate = true;
      ghostMesh.material.needsUpdate = true;
    }
  }
};

const animate = () => {
  if (!geometry || !renderer || !scene || !camera || !clock || !targetPositions) return;
  const delta = clock.getDelta();
  stateTimer += delta;
  if (stateTimer > shapeDurations[state]) {
    if (state === 'gather') setState('hold');
    else if (state === 'hold') setState('scatter');
    else if (state === 'scatter') setState('transition');
    else setState('gather');
  }

  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const current = geometry.getAttribute('currentPosition') as THREE.BufferAttribute;
  const progress = Math.min(1, stateTimer / shapeDurations[state]);

  const basis = state === 'scatter' ? 0.12 : 0.08;
  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    const tx = targetPositions[idx];
    const ty = targetPositions[idx + 1];
    const tz = targetPositions[idx + 2];

    let nx = positions.array[idx];
    let ny = positions.array[idx + 1];
    let nz = positions.array[idx + 2];

    if (state === 'gather' || state === 'hold') {
      nx += (tx - nx) * basis;
      ny += (ty - ny) * basis;
      nz += (tz - nz) * basis;
    } else if (state === 'scatter') {
      const offsetX = (Math.random() - 0.5) * 12 * progress;
      const offsetY = (Math.random() - 0.5) * 12 * progress;
      const offsetZ = (Math.random() - 0.5) * 16 * progress;
      nx += ((tx + offsetX * 8) - nx) * basis;
      ny += ((ty + offsetY * 8) - ny) * basis;
      nz += ((tz + offsetZ * 8) - nz) * basis;
    } else {
      nx += ((Math.random() - 0.5) * 300 - nx) * basis;
      ny += ((Math.random() - 0.5) * 300 - ny) * basis;
      nz += ((Math.random() - 0.5) * 300 - nz) * basis;
    }

    positions.array[idx] = nx;
    positions.array[idx + 1] = ny;
    positions.array[idx + 2] = nz;
  }

  positions.needsUpdate = true;

  if (silhouetteMesh && ghostMesh) {
    const phase = state === 'scatter' || state === 'transition' ? progress : 0;
    silhouetteMesh.material.opacity = THREE.MathUtils.lerp(0.95, 0.18, phase);
    ghostMesh.material.opacity = THREE.MathUtils.lerp(0.18, 0.72, phase);
    ghostMesh.position.x = 140 + Math.sin(stateTimer * 3.1) * (4 + phase * 22);
    silhouetteMesh.position.x = Math.sin(stateTimer * 0.18) * 8;
    silhouetteMesh.position.y = Math.cos(stateTimer * 0.1) * 4;
  }

  if (haloMesh) {
    haloMesh.rotation.z += 0.0018;
    haloMesh.position.y = Math.sin(stateTimer * 0.27) * 5;
  }

  if (camera) {
    const camTarget = new THREE.Vector3(0, 0, 0);
    const camX = Math.sin(stateTimer * 0.1 + shapeIndex) * 30;
    const camY = Math.cos(stateTimer * 0.09 + shapeIndex) * 14;
    const camZ = 520 + (state === 'transition' ? Math.sin(stateTimer * 2.2) * 18 : 0);
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
    camera.lookAt(camTarget);
  }

  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(animate);
};

const initScene = () => {
  if (!container.value || !canvas.value) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020014);

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera = new THREE.PerspectiveCamera(32, width / height, 1, 2000);
  camera.position.set(0, 0, 560);

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x020014, 1);

  const light = new THREE.DirectionalLight(0xc8deff, 1.2);
  light.position.set(0.4, 0.8, 1);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x1d2c5a, 0.75);
  scene.add(ambient);

  initializePoints();
  const texture = createParticleTexture();
  const material = new THREE.PointsMaterial({
    size: 2.2,
    map: texture,
    alphaTest: 0.01,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  points = new THREE.Points(geometry!, material);
  scene.add(points);

  silhouetteMesh = buildShapePlane(createSilhouetteTexture(shapes[shapeIndex], 1), 350, 260);
  silhouetteMesh.position.set(0, 0, -12);
  scene.add(silhouetteMesh);

  ghostMesh = buildShapePlane(createSilhouetteTexture(shapes[(shapeIndex + 1) % shapes.length], 0.38), 260, 200);
  ghostMesh.position.set(140, -18, -12);
  scene.add(ghostMesh);

  haloMesh = new THREE.Mesh(
    new THREE.RingGeometry(142, 152, 96),
    new THREE.MeshBasicMaterial({
      color: 0x7ea9ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
  );
  haloMesh.rotation.x = -Math.PI / 2.8;
  haloMesh.position.set(-18, -10, -22);
  scene.add(haloMesh);

  updateTargets(shapes[shapeIndex]);
  clock = new THREE.Clock();
  animationFrameId = requestAnimationFrame(animate);
  window.addEventListener('resize', resizeRenderer);
};

const cleanup = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeRenderer);
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
  points = null;
  geometry = null;
  clock = null;
};

onMounted(initScene);
onBeforeUnmount(cleanup);
</script>

<style scoped>
.quantum-particle-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.quantum-canvas {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
}
</style>
