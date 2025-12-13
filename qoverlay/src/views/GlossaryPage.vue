<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('名词解释页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('名词解释页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>{{ t('名词解释页面.标题') }}</h2>
                
                <ion-list>
                  <ion-item lines="inset" v-for="(term, index) in glossaryTerms" :key="index">
                    <ion-label>
                      <h3>{{ t(`名词解释.${term.key}.术语`) }}</h3>
                      <p class="term-description">{{ t(`名词解释.${term.key}.描述`) }}</p>
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
import { useI18n } from 'vue-i18n';

// 国际化
const { t } = useI18n();

// 定义名词解释数据结构
interface GlossaryTerm {
  key: string;
}

// 模拟名词解释数据
const glossaryTerms = ref<GlossaryTerm[]>([
  {
    key: "量子重叠"
  },
  {
    key: "量子交换"
  },
  {
    key: "直接量子交换量"
  },
  {
    key: "间接量子交换量"
  },
  {
    key: "跃迁量子交换量"
  },
  {
    key: "量子扩散抵达率"
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