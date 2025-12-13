<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>关于我们</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">关于我们</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <!-- 项目介绍 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>项目介绍</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>量子重叠计算工具是一款用于计算两个人之间量子重叠数量的应用。</p>
                <p>所谓量子重叠，是指人体 A 体内的量子来自人体 B 体内的数量。</p>
                <p>我们的核心目标是展现人与人与自然之间的量子重叠，认识到人与自然的一体化，实现人与人、自然之间的和谐共生，最终消除极端不平等、阶级，实现和平。</p>
                <p>该应用提供两种计算模式：速算版本和精算版本（订阅）。</p>
              </ion-card-content>
            </ion-card>

            <!-- 联系作者 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>联系作者</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-icon slot="start" :ios="mailOutline" :md="mailSharp" color="primary"></ion-icon>
                    <ion-label>邮箱</ion-label>
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
                <ion-card-title>开源协议</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>本项目采用 MIT 开源协议。</p>
                <p>MIT 许可证是一种宽松的开源许可证，允许您自由使用、复制、修改、合并、发布、分发、再许可和销售本软件及其副本。</p>
                <p>在软件和软件的所有副本中包含版权声明和许可声明即可。</p>
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
</script>

<style scoped>
ion-card {
  margin-bottom: 20px;
}
</style>