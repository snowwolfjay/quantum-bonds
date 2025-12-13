<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('条款页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('条款页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>{{ t('条款页面.标题') }}</h2>
                <p>{{ t('条款页面.更新日期') }}：2025年12月13日</p>
                
                <h3>{{ t('条款.引言.标题') }}</h3>
                <p>{{ t('条款.引言.第一段') }}</p>
                <p>{{ t('条款.引言.第二段') }}</p>
                
                <h3>{{ t('条款.服务条款.标题') }}</h3>
                <p>{{ t('条款.服务条款.计算模式') }}</p>
                <ul>
                  <li><strong>{{ t('条款.服务条款.速算版本') }}</strong>：{{ t('条款.服务条款.速算版本描述') }}</li>
                  <li><strong>{{ t('条款.服务条款.精算版本') }}</strong>：{{ t('条款.服务条款.精算版本描述') }}</li>
                </ul>
                <p>{{ t('条款.服务条款.变更权利') }}</p>
                
                <h3>{{ t('条款.用户权利义务.标题') }}</h3>
                <p><strong>{{ t('条款.用户权利义务.您的权利') }}：</strong></p>
                <ul>
                  <li>{{ t('条款.用户权利义务.权利.使用服务') }}</li>
                  <li>{{ t('条款.用户权利义务.权利.获得结果') }}</li>
                  <li>{{ t('条款.用户权利义务.权利.分享结果') }}</li>
                </ul>
                <p><strong>{{ t('条款.用户权利义务.您的义务') }}：</strong></p>
                <ul>
                  <li>{{ t('条款.用户权利义务.义务.提供准确信息') }}</li>
                  <li>{{ t('条款.用户权利义务.义务.遵守法律') }}</li>
                  <li>{{ t('条款.用户权利义务.义务.不滥用服务') }}</li>
                  <li>{{ t('条款.用户权利义务.义务.不侵犯知识产权') }}</li>
                </ul>
                
                <h3>{{ t('条款.服务变更终止.标题') }}</h3>
                <p>{{ t('条款.服务变更终止.第一段') }}</p>
                <p>{{ t('条款.服务变更终止.第二段') }}</p>
                
                <h3>{{ t('条款.知识产权.标题') }}</h3>
                <p>{{ t('条款.知识产权.第一段') }}</p>
                <p>{{ t('条款.知识产权.第二段') }}</p>
                
                <h3>{{ t('条款.免责声明.标题') }}</h3>
                <p>{{ t('条款.免责声明.第一段') }}</p>
                <p>{{ t('条款.免责声明.第二段') }}</p>
                
                <h3>{{ t('条款.责任限制.标题') }}</h3>
                <p>{{ t('条款.责任限制.内容') }}</p>
                
                <h3>{{ t('条款.法律适用争议解决.标题') }}</h3>
                <p>{{ t('条款.法律适用争议解决.法律管辖') }}</p>
                <p>{{ t('条款.法律适用争议解决.争议解决') }}</p>
                
                <h3>{{ t('条款.条款变更.标题') }}</h3>
                <p>{{ t('条款.条款变更.第一段') }}</p>
                <p>{{ t('条款.条款变更.第二段') }}</p>
                
                <h3>{{ t('条款.联系我们.标题') }}</h3>
                <p>{{ t('条款.联系我们.内容') }}</p>
                <p>{{ t('条款.联系我们.邮箱') }}：terms@quantum-overlay.example</p>
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

strong {
  font-weight: bold;
  color: var(--ion-color-primary-shade);
}
</style>