<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>赞助</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">赞助</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <!-- 订阅入口 -->
            <ion-card color="primary" class="subscription-card">
              <ion-card-header>
                <ion-card-title class="ion-text-center">订阅精算版本</ion-card-title>
                <ion-card-subtitle class="ion-text-center">解锁更多高级功能</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-icon slot="start" :ios="checkmarkCircleOutline" :md="checkmarkCircleSharp" color="light"></ion-icon>
                    <ion-label color="light">更详细的量子重叠计算结果</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon slot="start" :ios="checkmarkCircleOutline" :md="checkmarkCircleSharp" color="light"></ion-icon>
                    <ion-label color="light">不同分类的量子扩散抵达率展示</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon slot="start" :ios="checkmarkCircleOutline" :md="checkmarkCircleSharp" color="light"></ion-icon>
                    <ion-label color="light">量子重叠数量和百分比展示</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon slot="start" :ios="checkmarkCircleOutline" :md="checkmarkCircleSharp" color="light"></ion-icon>
                    <ion-label color="light">可定制的分享页面</ion-label>
                  </ion-item>
                </ion-list>
                <ion-button expand="block" color="light" fill="solid">
                  <ion-icon slot="start" :ios="cardOutline" :md="cardSharp"></ion-icon>
                  立即订阅
                </ion-button>
              </ion-card-content>
            </ion-card>

            <!-- 赞助人员列表 -->
            <ion-card>
              <ion-card-header>
                <ion-card-title>赞助人员</ion-card-title>
                <ion-card-subtitle>感谢以下赞助者对我们的支持</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item v-for="sponsor in sponsors" :key="sponsor.id" lines="inset">
                    <ion-avatar slot="start">
                      <img :src="getAvatarUrl(sponsor.name)" :alt="sponsor.name" />
                    </ion-avatar>
                    <ion-label>
                      <h3>{{ sponsor.name }}</h3>
                      <p>{{ sponsor.level }}</p>
                    </ion-label>
                    <ion-note slot="end">{{ sponsor.amount }}</ion-note>
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
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  IonAvatar,
  IonButton
} from '@ionic/vue';
import { ref } from 'vue';
import { checkmarkCircleOutline, checkmarkCircleSharp, cardOutline, cardSharp } from 'ionicons/icons';

// 定义赞助人员数据结构
interface Sponsor {
  id: number;
  name: string;
  level: string;
  amount: string;
}

// 模拟赞助人员数据
const sponsors = ref<Sponsor[]>([
  { id: 1, name: '张三', level: '钻石赞助', amount: '¥1000' },
  { id: 2, name: '李四', level: '黄金赞助', amount: '¥500' },
  { id: 3, name: '王五', level: '白银赞助', amount: '¥200' },
  { id: 4, name: '赵六', level: '青铜赞助', amount: '¥100' },
  { id: 5, name: '孙七', level: '青铜赞助', amount: '¥100' },
  { id: 6, name: '周八', level: '青铜赞助', amount: '¥100' },
  { id: 7, name: '吴九', level: '青铜赞助', amount: '¥100' },
  { id: 8, name: '郑十', level: '青铜赞助', amount: '¥100' }
]);

// 生成头像URL（使用第三方服务）
function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
}
</script>

<style scoped>
.subscription-card {
  margin-top: 20px;
  margin-bottom: 30px;
}

.subscription-card ion-card-title,
.subscription-card ion-card-subtitle {
  color: white;
}

.sponsor-list {
  margin-top: 20px;
}

ion-avatar img {
  border-radius: 50%;
}

h3 {
  font-weight: 600;
  margin: 0;
}

p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 14px;
}
</style>