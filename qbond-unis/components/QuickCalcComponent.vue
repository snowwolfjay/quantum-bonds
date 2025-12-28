<template>
  <view class="quick-calc-container">
    <view class="input-section">
      <view class="section-title">{{ t('计算页面.快速.副标题') }}</view>

      <person-input-component
        :title="t('计算页面.人员.A')"
        :person="personA"
        @update="updatePersonA"
      />

      <person-input-component
        :title="t('计算页面.人员.B')"
        :person="personB"
        @update="updatePersonB"
      />

      <view class="minimum-age-section">
        <view class="input-container">
          <view class="input-label">{{ t('计算页面.最小年龄') }}</view>
          <view class="auto-calculated-age" :class="{ 'age-not-calculated': !minimumAge }">
            {{ minimumAge ? `${minimumAge} ${t('计算页面.人员.岁')}` : t('计算页面.错误.年龄未计算') }}
          </view>
        </view>
      </view>

      <view v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </view>

      <button class="calculate-button" @click="calculate" :disabled="!isFormValid">
        {{ t('计算页面.快速.计算') }}
      </button>
    </view>

    <view v-if="showResult" class="result-section">
      <view class="result-card">
        <view class="result-header">{{ t('计算页面.快速.结果') }}</view>
        <view class="result-content">
          <view class="result-value">{{ result.overlapAmount.toExponential(2) }}</view>
          <view class="result-description">
            {{ t('计算页面.快速.重叠描述') }}
          </view>
        </view>
      </view>

      <button class="share-button" @click="openShareModal">
        <text class="button-icon">📤</text>
        {{ t('计算页面.快速.分享') }}
      </button>
    </view>

    <uni-popup ref="sharePopup" type="center">
      <view class="share-modal-content">
        <view class="modal-header">
          <view class="modal-title">{{ t('计算页面.快速.分享') }}</view>
          <button class="close-button" @click="closeShareModal">✕</button>
        </view>
        <view class="canvas-container">
          <canvas
            canvas-id="shareCanvas"
            id="shareCanvas"
            class="share-canvas"
            style="width: 600rpx; height: 300rpx;"
          ></canvas>
        </view>
        <view class="share-actions">
          <button class="action-button primary" @click="shareFromCanvas">
            <text class="button-icon">📤</text>
            {{ t('计算页面.快速.分享') }}
          </button>
          <button class="action-button" @click="closeShareModal">
            {{ t('编辑模态框.取消') }}
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { calculateQuickQuantumOverlap } from '../utils/quickCalc';
import { drawShareContent, shareImage } from '../utils/shareUtils';
import PersonInputComponent from './PersonInputComponent.vue';

interface PersonData {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

interface Location {
  lat: number;
  lon: number;
}

interface Result {
  overlapAmount: number;
}

const { t } = useI18n();

const personA = ref<PersonData>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

const personB = ref<PersonData>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

const minimumAge = computed(() => {
  if (personA.value.age !== null && personB.value.age !== null) {
    return Math.min(personA.value.age, personB.value.age);
  }
  return null;
});

const errorMessage = ref('');
const showResult = ref(false);
const result = ref<Result>({
  overlapAmount: 0
});

const sharePopup = ref();
const overlapPercentage = ref(0);

const isFormValid = computed(() => {
  return (
    personA.value.location &&
    personA.value.weight &&
    personA.value.height &&
    personB.value.location &&
    personB.value.weight &&
    personB.value.height &&
    minimumAge.value !== null
  );
});

function parseLocation(locationStr: string): Location {
  const [lat, lon] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
  return { lat, lon };
}

const updatePersonA = (newPerson: PersonData): void => {
  if (newPerson.name && personB.value.name === newPerson.name) {
    errorMessage.value = t('计算页面.错误.人员重复');
    return;
  }
  personA.value = { ...newPerson };
  errorMessage.value = '';
};

const updatePersonB = (newPerson: PersonData): void => {
  if (newPerson.name && personA.value.name === newPerson.name) {
    errorMessage.value = t('计算页面.错误.人员重复');
    return;
  }
  personB.value = { ...newPerson };
  errorMessage.value = '';
};

const calculate = (): void => {
  if (!isFormValid.value) return;

  try {
    const locationA = parseLocation(personA.value.location);
    const locationB = parseLocation(personB.value.location);

    const overlapAmount = calculateQuickQuantumOverlap({
      personA: {
        location: locationA,
        weight: personA.value.weight,
        height: personA.value.height
      },
      personB: {
        location: locationB,
        weight: personB.value.weight,
        height: personB.value.height
      },
      minimumAge: minimumAge.value
    });

    result.value.overlapAmount = overlapAmount;
    showResult.value = true;
  } catch (error) {
    console.error('计算错误:', error);
    uni.showToast({
      title: t('错误.计算失败'),
      icon: 'none'
    });
  }
};

const openShareModal = (): void => {
  sharePopup.value?.open();
  setTimeout(() => {
    renderShareCanvas();
  }, 100);
};

const closeShareModal = (): void => {
  sharePopup.value?.close();
};

const renderShareCanvas = (): void => {
  const canvas = uni.createCanvasContext('shareCanvas');
  if (!canvas) return;

  const personAName = personA.value.name || t('计算页面.人员.A');
  const personBName = personB.value.name || t('计算页面.人员.B');

  drawShareContent(canvas, personAName, personBName, result.value.overlapAmount, overlapPercentage.value);
};

const shareFromCanvas = (): void => {
  uni.canvasToTempFilePath({
    canvasId: 'shareCanvas',
    success: (res) => {
      shareImage(
        t('分享.标题'),
        t('计算页面.快速.重叠描述'),
        res.tempFilePath,
        () => {
          uni.showToast({
            title: t('分享.已复制'),
            icon: 'success'
          });
          closeShareModal();
        },
        (error) => {
          console.error('分享失败:', error);
          uni.showToast({
            title: t('分享.已复制'),
            icon: 'success'
          });
          closeShareModal();
        }
      );
    }
  });
};
</script>

<style scoped>
.quick-calc-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  padding: 8px 0;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.result-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  overflow: hidden;
}

.result-header {
  padding: 16px;
  background-color: #f5f5f5;
  font-size: 18px;
  font-weight: 600;
  color: #007AFF;
  text-align: center;
}

.result-content {
  padding: 20px;
  text-align: center;
}

.result-value {
  font-size: 36px;
  font-weight: bold;
  color: #007AFF;
  margin: 20px 0;
}

.result-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.minimum-age-section {
  margin-top: 12px;
  margin-bottom: 16px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.auto-calculated-age {
  padding: 12px 16px;
  font-size: 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.age-not-calculated {
  color: #999;
  font-style: italic;
}

.error-message {
  padding: 12px;
  background-color: #fff3f0;
  color: #ff4757;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 12px;
}

.calculate-button {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.calculate-button:disabled {
  opacity: 0.5;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  background: #5856D6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-icon {
  font-size: 20px;
}

.share-modal-content {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
}

.share-canvas {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.action-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.action-button.primary {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
  border-color: #007AFF;
}
</style>
