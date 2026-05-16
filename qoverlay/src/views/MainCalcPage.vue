<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t('计算页面.标题') }}</ion-title>
        <!-- <ion-segment v-model="calculationMode" color="primary" disabled>
                  <ion-segment-button value="quick">
                    <ion-label>{{ $t('计算页面.快速.标题') }}</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="precise">
                    <ion-label>{{ $t('计算页面.精确.标题') }}</ion-label>
                  </ion-segment-button>
                </ion-segment> -->
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="main-calc-page">
      <div class="scene-overlay">
        <ParticalFlow />
      </div>
      <!-- 速算版本组件 -->
      <QuickCalcComponent v-if="calculationMode === 'quick'" />

      <!-- 精算版本组件 -->
      <PreciseCalcComponent v-else />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
import { ref } from 'vue';
import QuickCalcComponent from '../components/QuickCalcComponent.vue';
import PreciseCalcComponent from '../components/PreciseCalcComponent.vue';
import QuantumParticleScene from '../components/QuantumParticleScene.vue';
import ParticalFlow from '@/feat/particalEffect/ParticalFlow.vue';

// 定义计算模式类型
type CalculationMode = 'quick' | 'precise';

// 初始化计算模式
const calculationMode = ref<CalculationMode>('quick');
</script>

<style scoped>
.main-calc-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: radial-gradient(circle at top center, rgba(90, 98, 255, 0.18), transparent 24%),
    radial-gradient(circle at 15% 80%, rgba(55, 196, 255, 0.12), transparent 20%),
    #030314;
  overflow: hidden;
}

.scene-overlay {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  pointer-events: none;
}

.page-shell {
  position: relative;
  z-index: 2;
  min-height: 100%;
}

.page-panel {
  background: rgba(6, 10, 30, 0.78);
  border: 1px solid rgba(115, 175, 255, 0.16);
  box-shadow: 0 32px 120px rgba(36, 72, 162, 0.18);
  border-radius: 32px;
  backdrop-filter: blur(24px);
  padding: 1.5rem;
}

.page-title-bar {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #edf4ff;
}

.page-subtitle {
  font-size: 0.92rem;
  color: rgba(226, 239, 255, 0.72);
}

@media (max-width: 768px) {
  .page-panel {
    margin: 0 0.5rem;
    padding: 1.25rem;
  }
}
</style>