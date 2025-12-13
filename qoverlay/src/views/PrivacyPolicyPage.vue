<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('隐私政策页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('隐私政策页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>{{ t('隐私政策页面.标题') }}</h2>
                <p>{{ t('隐私政策页面.更新日期') }}：2025年12月13日</p>
                
                <h3>{{ t('隐私政策.引言.标题') }}</h3>
                <p>{{ t('隐私政策.引言.内容') }}</p>
                
                <h3>{{ t('隐私政策.收集信息.标题') }}</h3>
                <p>{{ t('隐私政策.收集信息.内容') }}</p>
                <ul>
                  <li>{{ t('隐私政策.收集信息.项目.个人数据') }}</li>
                  <li>{{ t('隐私政策.收集信息.项目.计算参数') }}</li>
                  <li>{{ t('隐私政策.收集信息.项目.设备信息') }}</li>
                  <li>{{ t('隐私政策.收集信息.项目.使用数据') }}</li>
                </ul>
                
                <h3>{{ t('隐私政策.使用信息.标题') }}</h3>
                <p>{{ t('隐私政策.使用信息.内容') }}</p>
                <ul>
                  <li>{{ t('隐私政策.使用信息.项目.提供服务') }}</li>
                  <li>{{ t('隐私政策.使用信息.项目.处理请求') }}</li>
                  <li>{{ t('隐私政策.使用信息.项目.生成结果') }}</li>
                  <li>{{ t('隐私政策.使用信息.项目.优化体验') }}</li>
                </ul>
                
                <h3>{{ t('隐私政策.信息共享.标题') }}</h3>
                <p>{{ t('隐私政策.信息共享.内容') }}</p>
                <ul>
                  <li>{{ t('隐私政策.信息共享.项目.明确同意') }}</li>
                  <li>{{ t('隐私政策.信息共享.项目.法律法规') }}</li>
                  <li>{{ t('隐私政策.信息共享.项目.保护权益') }}</li>
                  <li>{{ t('隐私政策.信息共享.项目.服务提供商') }}</li>
                </ul>
                
                <h3>{{ t('隐私政策.数据安全.标题') }}</h3>
                <p>{{ t('隐私政策.数据安全.内容') }}</p>
                
                <h3>{{ t('隐私政策.数据保留.标题') }}</h3>
                <p>{{ t('隐私政策.数据保留.内容') }}</p>
                
                <h3>{{ t('隐私政策.用户权利.标题') }}</h3>
                <p>{{ t('隐私政策.用户权利.内容') }}</p>
                <ul>
                  <li>{{ t('隐私政策.用户权利.项目.访问更正删除') }}</li>
                  <li>{{ t('隐私政策.用户权利.项目.限制反对') }}</li>
                  <li>{{ t('隐私政策.用户权利.项目.数据可携带') }}</li>
                  <li>{{ t('隐私政策.用户权利.项目.撤回同意') }}</li>
                </ul>
                
                <h3>{{ t('隐私政策.政策变更.标题') }}</h3>
                <p>{{ t('隐私政策.政策变更.内容') }}</p>
                
                <h3>{{ t('隐私政策.联系我们.标题') }}</h3>
                <p>{{ t('隐私政策.联系我们.内容') }}</p>
                <p>{{ t('隐私政策.联系我们.邮箱') }}：privacy@quantum-overlay.example</p>
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
  IonCardContent
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';

// 国际化
const { t } = useI18n();
</script>

<style scoped>
ion-card {
  margin-top: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--ion-color-primary);
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 15px;
  color: var(--ion-color-primary-shade);
}

p {
  margin-bottom: 15px;
  line-height: 1.6;
}

ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}
</style>