<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons> 
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

    <ion-content :fullscreen="true">

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">

            <!-- 速算版本组件 -->
            <QuickCalcComponent v-if="calculationMode === 'quick'" />

            <!-- 精算版本组件 -->
            <PreciseCalcComponent v-else />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue';
import { ref } from 'vue';
import QuickCalcComponent from '../components/QuickCalcComponent.vue';
import PreciseCalcComponent from '../components/PreciseCalcComponent.vue';

// 定义计算模式类型
type CalculationMode = 'quick' | 'precise';

// 初始化计算模式
const calculationMode = ref<CalculationMode>('quick');
</script>

<style scoped></style>