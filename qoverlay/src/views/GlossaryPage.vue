<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>名词解释</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">名词解释</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>名词解释</h2>
                
                <ion-list>
                  <ion-item lines="inset" v-for="(term, index) in glossaryTerms" :key="index">
                    <ion-label>
                      <h3>{{ term.term }}</h3>
                      <p class="term-description">{{ term.description }}</p>
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

// 定义名词解释数据结构
interface GlossaryTerm {
  term: string;
  description: string;
}

// 模拟名词解释数据
const glossaryTerms = ref<GlossaryTerm[]>([
  {
    term: "量子重叠",
    description: "指人体 A 体内的量子来自人体 B 体内的数量。"
  },
  {
    term: "量子交换",
    description: "人体之间通过各种方式进行的量子传递过程。"
  },
  {
    term: "直接量子交换量",
    description: "人体 A 体内的量子，直接流向人体 B 体内的数量，基于热运动和速度。"
  },
  {
    term: "间接量子交换量",
    description: "人体 A 体内的量子，通过其他中间体，流向人体 B 体内的数量，基于气流和其它运动物体。"
  },
  {
    term: "跃迁量子交换量",
    description: "人体 A 体内的量子，通过量子跃迁，流向人体 B 体内的数量，亚光速级别量子的传输量。"
  },
  {
    term: "量子扩散抵达率",
    description: "一个和距离相关的参数或者函数，指代 A 扩散到环境的量子抵达 B 体内的概率/比例。"
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
  margin-bottom: 10px;
}

.term-description {
  line-height: 1.6;
}
</style>