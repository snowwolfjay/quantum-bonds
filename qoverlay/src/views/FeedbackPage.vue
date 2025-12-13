<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>反馈</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">反馈</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-header>
                <ion-card-title>发送反馈</ion-card-title>
                <ion-card-subtitle>请告诉我们您的想法和建议</ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <form @submit.prevent="submitFeedback">
                  <ion-list>
                    <!-- 姓名输入 -->
                    <ion-item>
                      <ion-label position="floating">姓名</ion-label>
                      <ion-input v-model="feedback.name" required></ion-input>
                    </ion-item>

                    <!-- 邮箱输入 -->
                    <ion-item>
                      <ion-label position="floating">邮箱</ion-label>
                      <ion-input v-model="feedback.email" type="email" required></ion-input>
                    </ion-item>

                    <!-- 反馈类型选择 -->
                    <ion-item>
                      <ion-label position="floating">反馈类型</ion-label>
                      <ion-select v-model="feedback.type" placeholder="请选择反馈类型" required>
                        <ion-select-option value="suggestion">建议</ion-select-option>
                        <ion-select-option value="bug"> bug 报告</ion-select-option>
                        <ion-select-option value="question">问题</ion-select-option>
                        <ion-select-option value="other">其他</ion-select-option>
                      </ion-select>
                    </ion-item>

                    <!-- 反馈内容输入 -->
                    <ion-item>
                      <ion-label position="stacked">反馈内容</ion-label>
                      <ion-textarea v-model="feedback.content" :rows="6" required></ion-textarea>
                    </ion-item>

                    <!-- 提交按钮 -->
                    <ion-item lines="none">
                      <ion-button expand="block" type="submit" color="primary" :disabled="isSubmitting">
                        <ion-spinner v-if="isSubmitting" slot="start" name="circles"></ion-spinner>
                        {{ isSubmitting ? '提交中...' : '提交反馈' }}
                      </ion-button>
                    </ion-item>
                  </ion-list>
                </form>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- 成功提示 -->
      <ion-toast
        :is-open="showSuccessToast"
        message="反馈提交成功！感谢您的支持。"
        color="success"
        duration="3000"
        position="bottom"
      ></ion-toast>
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
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonToast
} from '@ionic/vue';
import { ref } from 'vue';

// 定义反馈数据结构
interface Feedback {
  name: string;
  email: string;
  type: string;
  content: string;
}

// 初始化反馈数据
const feedback = ref<Feedback>({
  name: '',
  email: '',
  type: '',
  content: ''
});

// 提交状态
const isSubmitting = ref(false);

// 成功提示状态
const showSuccessToast = ref(false);

// 提交反馈
const submitFeedback = () => {
  isSubmitting.value = true;

  // 模拟API请求
  setTimeout(() => {
    // 重置表单
    feedback.value = {
      name: '',
      email: '',
      type: '',
      content: ''
    };

    // 显示成功提示
    showSuccessToast.value = true;

    // 重置提交状态
    isSubmitting.value = false;
  }, 1500);
};
</script>

<style scoped>
ion-card {
  margin-top: 20px;
}

ion-item:last-child {
  margin-top: 20px;
}
</style>