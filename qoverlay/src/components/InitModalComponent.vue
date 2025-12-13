<template>
  <ion-modal
    :is-open="isOpen"
    @did-dismiss="handleDismiss"
    backdrop-dismiss="false"
  >
    <ion-content class="ion-padding">
      <!-- 欢迎信息 -->
      <div class="welcome-section">
        <!-- Logo -->
        <div class="logo-container">
          <div class="logo">
            <ion-icon :icon="calculatorOutline" size="large"></ion-icon>
          </div>
        </div>
        <h2 class="welcome-title">{{ t("初始化.欢迎") }}</h2>
        <p class="welcome-text">{{ t("初始化.欢迎描述") }}</p>
      </div>

      <!-- 个人信息表单 -->
      <form @submit.prevent="handleSubmit">
        <info-input-component
          ref="infoInput"
          v-model="userData"
          :touched="touched"
          @reset-touched="touched = false"
        ></info-input-component>
      </form>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button
          expand="block"
          color="primary"
          @click="handleSubmit"
          class="large-button"
        >
          {{ t("初始化.确认") }}
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonToolbar,
} from "@ionic/vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Person } from "../services/dbService";
import { calculatorOutline } from "ionicons/icons";
import InfoInputComponent from "./InfoInputComponent.vue";
const infoInput = ref<InstanceType<typeof InfoInputComponent>>();
// 国际化
const { t } = useI18n();

// Props
const props = defineProps<{
  isOpen: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", userData: Omit<Person, "id">): void;
}>();

// 用户数据
const userData = ref<Omit<Person, "id">>({
  name: "我",
  location: "",
  weight: 55,
  height: 170,
  age: null,
});

// 标记是否已经触发过验证
const touched = ref(false);

// 验证表单
const validateForm = (): boolean => {
  return !!infoInput.value?.validateForm(userData.value);
};

// 处理表单提交
const handleSubmit = () => {
  touched.value = true;
  if (validateForm()) {
    emit("confirm", userData.value);
  }
};

// 处理模态框关闭
const handleDismiss = () => {
  emit("close");
};
</script>

<style scoped>
.welcome-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 20px 0;
}

/* Logo样式 */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--ion-color-primary),
    var(--ion-color-secondary)
  );
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo ion-icon {
  color: white;
  font-size: 40px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--ion-color-primary);
}

.welcome-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--ion-text-color-medium);
  max-width: 500px;
  margin: 0 auto 24px;
}

ion-footer {
  --background: var(--ion-background-color);
  --border-color: var(--ion-border-color);
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-button {
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  --box-shadow: 0 2px 8px rgba(var(--ion-color-primary-rgb), 0.3);
}

/* 大按钮样式 */
.large-button {
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  --border-radius: 12px;
  width: 100%;
  margin: 0;
  --box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.4);
}
</style>
