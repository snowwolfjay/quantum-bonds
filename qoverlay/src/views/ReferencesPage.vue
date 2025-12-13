<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>参考文献</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">参考文献</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>参考文献</h2>
                
                <ion-list>
                  <ion-item lines="inset" v-for="(reference, index) in references" :key="index">
                    <ion-label>
                      <h3>{{ reference.title }}</h3>
                      <p>{{ reference.author }} - {{ reference.year }}</p>
                      <p class="reference-content">{{ reference.content }}</p>
                      <p class="reference-link"><a :href="reference.link" target="_blank">{{ reference.link }}</a></p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
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
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { ref } from 'vue';

// 定义参考文献数据结构
interface Reference {
  title: string;
  author: string;
  year: string;
  content: string;
  link: string;
}

// 模拟参考文献数据
const references = ref<Reference[]>([
  {
    title: "量子力学基础",
    author: "张三",
    year: "2023",
    content: "本书介绍了量子力学的基本概念和原理，包括波粒二象性、不确定性原理等。",
    link: "https://example.com/reference1"
  },
  {
    title: "人体量子交换机制",
    author: "李四",
    year: "2024",
    content: "研究了人体之间量子交换的可能机制和影响因素。",
    link: "https://example.com/reference2"
  },
  {
    title: "量子重叠计算模型",
    author: "王五",
    year: "2025",
    content: "提出了一种计算人与人之间量子重叠的数学模型。",
    link: "https://example.com/reference3"
  }
]);
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
}

.reference-link {
  margin-top: 10px;
  font-size: 14px;
}

.reference-link a {
  color: var(--ion-color-primary);
  text-decoration: none;
}

.reference-link a:hover {
  text-decoration: underline;
}
</style>