<template>
  <uni-popup ref="initPopup" type="center" :mask-click="false">
    <view class="init-modal-content">
      <view class="welcome-section">
        <view class="logo-container">
          <view class="logo">
            <text class="logo-icon">📊</text>
          </view>
        </view>
        <view class="welcome-title">{{ t("初始化.欢迎") }}</view>
        <view class="welcome-text">{{ t("初始化.欢迎描述") }}</view>
      </view>

      <view class="form-section">
        <info-input-component
          ref="infoInput"
          v-model="userData"
          :touched="touched"
          @reset-touched="touched = false"
        ></info-input-component>
      </view>

      <view class="button-section">
        <button class="confirm-button" @click="handleSubmit">
          {{ t("初始化.确认") }}
        </button>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InfoInputComponent from './InfoInputComponent.vue';

interface PersonData {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', data: PersonData): void;
}>();

const { t } = useI18n();
const initPopup = ref();
const infoInput = ref();

const userData = ref<PersonData>({
  name: '我',
  location: '',
  weight: 55,
  height: 170,
  age: null
});

const touched = ref(false);

const validateForm = (): boolean => {
  return infoInput.value?.validateForm(userData.value);
};

const handleSubmit = (): void => {
  touched.value = true;
  if (validateForm()) {
    emit('confirm', userData.value);
  }
};

const open = (): void => {
  initPopup.value?.open();
};

const close = (): void => {
  initPopup.value?.close();
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    open();
  } else {
    close();
  }
});

defineExpose({
  open,
  close
});
</script>

<style scoped>
.init-modal-content {
  width: 500rpx;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 32rpx;
  padding: 20rpx 0;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo-icon {
  font-size: 80rpx;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16rpx;
  color: #007AFF;
}

.welcome-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  max-width: 500rpx;
  margin: 0 auto 24rpx;
}

.form-section {
  margin-bottom: 24rpx;
}

.button-section {
  margin-top: 32rpx;
}

.confirm-button {
  width: 100%;
  padding: 24rpx;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
}

.confirm-button:active {
  opacity: 0.8;
}
</style>
