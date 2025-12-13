<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('关于页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('关于页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <!-- 项目介绍 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ t('关于页面.项目介绍.标题') }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ t('关于页面.项目介绍.第一段') }}</p>
                <p>{{ t('关于页面.项目介绍.第二段') }}</p>
                <p>{{ t('关于页面.项目介绍.第三段') }}</p>
                <p>{{ t('关于页面.项目介绍.第四段') }}</p>
              </ion-card-content>
            </ion-card>

            <!-- 联系作者 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ t('关于页面.联系作者.标题') }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-icon slot="start" :ios="mailOutline" :md="mailSharp" color="primary"></ion-icon>
                    <ion-label>{{ t('关于页面.联系作者.邮箱') }}</ion-label>
                    <ion-note slot="end">contact@quantum-overlay.example</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-icon slot="start" :ios="logoGithub" :md="logoGithub" color="primary"></ion-icon>
                    <ion-label>GitHub</ion-label>
                    <ion-note slot="end">github.com/quantum-overlay</ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <!-- 开源协议 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ t('关于页面.开源协议.标题') }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ t('关于页面.开源协议.第一段') }}</p>
                <p>{{ t('关于页面.开源协议.第二段') }}</p>
                <p>{{ t('关于页面.开源协议.第三段') }}</p>
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
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote
} from '@ionic/vue';
import { mailOutline, mailSharp, logoGithub } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

// 国际化
const { t } = useI18n();
</script>

<style scoped>
ion-card {
  margin-bottom: 20px;
}
</style>