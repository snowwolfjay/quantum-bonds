<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('参考文献页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('参考文献页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item lines="inset" v-for="(reference, index) in references" :key="index">
          <ion-label>
            <h3>{{ reference.title }}</h3>
            <p>{{ reference.author }} </p>
            <p v-if="reference.code">{{ reference.code }}</p>
            <p class="reference-content">{{ reference.content }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonTitle,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// 国际化
const { t, ...rest } = useI18n();

// 定义参考文献数据结构
interface Reference {
  title: string;
  author: string;
  year: string;
  content: string;
  code: string;
}

// 模拟参考文献数据
const references = computed(() => (rest.messages.value[rest.locale.value as any]['参考文献'] || []) as Reference[]);

console.log('参考文献数据:', references, rest.messages);
</script>

<style scoped>
h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--ion-color-primary);
}

ion-item {
  margin-bottom: 10px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.reference-content {
  margin: 10px 0;
  line-height: 1.6;
  color: var(--ion-text-color);
}

.reference-link {
  margin-top: 10px;
  font-size: 14px;
}

.reference-link .desc {
  color: var(--ion-color-primary);
  text-decoration: none;
}
</style>