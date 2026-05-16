<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>QShift Animation Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="animation-container">
        <QuantumnShift1 />
      </div>
      <div class="info-section">
        <h2>QShift Animation</h2>
        <p>分镜动画效果测试页面</p>
        <p>核心视觉元素：闪着淡红色的光点</p>
        <p>功能：镜头追踪、循环动画、无缝衔接</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import QShiftAnimation from '../feat/qshift/QShiftAnimation.vue'
import QuantumnShift1 from '@/feat/qshift/QuantumnShift1.vue';
</script>

<style scoped>
.animation-container {
  width: 100%;
  height: 60vh;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
}

.info-section {
  background: rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 12px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 8px;
}
</style>