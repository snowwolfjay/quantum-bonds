<template>
  <div class="quick-calc-container">
    <!-- 输入部分 -->
    <div class="input-section">
      <!-- <h2 class="section-title">{{ t('计算页面.快速.副标题') }}</h2> -->

      <!-- 人体 A 输入组件 -->
      <PersonInputComponent :title="t('计算页面.人员.A')" :person="personA" @update="updatePersonA" />

      <!-- 人体 B 输入组件 -->
      <PersonInputComponent :title="t('计算页面.人员.B')" :person="personB" @update="updatePersonB" />

      <!-- 自动计算的最小年龄显示 -->
      <div class="minimum-age-section">
        <div class="input-container">
          <label class="input-label">{{ t('计算页面.最小年龄') }}</label>
          <div class="auto-calculated-age" :class="{ 'age-not-calculated': !minimumAge }">
            {{ minimumAge ? `${minimumAge} ${t('计算页面.人员.岁')}` : t('计算页面.错误.年龄未计算') }}
          </div>
        </div>
        <div class="distance-edit">
          <!-- 预设距离输入框 -->
          <label class="input-label">{{ t('计算页面.预设距离') }}</label>
          <input type="number" class="custom-input" v-model.number="distanceInput" placeholder="米" min="0" />
        </div>
      </div>

      <!-- 错误信息显示 -->
      <div v-if="errorMessage" class="error-message">
        <ion-text color="danger">
          {{ errorMessage }}
        </ion-text>
      </div>

      <!-- 计算按钮 -->
      <ion-button expand="block" color="primary" @click="calculate">
        {{ t('计算页面.快速.计算') }}
      </ion-button>
    </div>

    <!-- 结果模态窗口 -->
    <ion-modal :is-open="isResultModalOpen" @did-dismiss="closeResultModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('计算页面.快速.结果') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeResultModal">{{ t('编辑模态框.取消') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card class="result-card">
          <ion-card-header>
            <ion-card-title>{{ t('计算页面.快速.结果') }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="result-value">{{ result.overlapAmount.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) }}
            </div>
            <div class="result-description">
              {{ t('计算页面.快速.重叠描述') }}
            </div>
          </ion-card-content>
        </ion-card>

        <div class="share-actions">
          <ion-button expand="block" color="secondary" @click="openShareModal">
            <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
            {{ t('计算页面.快速.分享') }}
          </ion-button>
          <!-- <ion-button expand="block" @click="closeResultModal">
            {{ t('编辑模态框.取消') }}
          </ion-button> -->
        </div>
      </ion-content>
    </ion-modal>

    <!-- 分享模态窗口 -->
    <ion-modal :is-open="isShareModalOpen" @did-dismiss="closeShareModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('计算页面.快速.分享') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeShareModal">{{ t('编辑模态框.取消') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="share-modal-content">
          <div v-if="isShareRendering" class="share-progress">
            <ion-spinner name="crescent"></ion-spinner>
            <div class="share-progress-text">{{ t('计算页面.快速.分享渲染中') }}</div>
            <div class="share-progress-description">{{ t('计算页面.快速.分享渲染说明') }}</div>
          </div>

          <div v-else class="share-preview-section">
            <div class="share-preview-title">{{ t('计算页面.快速.分享预览') }}</div>
            <img v-if="sharePreviewUrl" :src="sharePreviewUrl" alt="share preview" class="share-preview-image" />
            <div class="share-actions">
              <ion-button expand="block" color="primary" @click="shareFromCanvas">
                <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
                {{ t('计算页面.快速.立即分享') }}
              </ion-button>
              <!-- <ion-button expand="block" @click="closeShareModal">
                {{ t('编辑模态框.取消') }}
              </ion-button> -->
            </div>
          </div>
        </div>

        <canvas ref="shareCanvas" width="720" height="1270" class="share-canvas hidden-canvas"></canvas>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import {
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonHeader,
  IonTitle,
  IonModal,
  IonText,
  IonCard,
  IonIcon
} from '@ionic/vue';
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { shareOutline, shareSharp } from 'ionicons/icons';
import { calculateDistance, calculateQuickQuantumOverlap } from '../utils/quickCalc';
import { drawShareContent, canvasToBase64, shareImage } from '../utils/shareUtils';
import PersonInputComponent from './PersonInputComponent.vue';
import { calculateTotalOverlap, estimateTotalQuantum } from '@/services/quick-calc';
import { injectDbService } from '@/services/dbService';

// 国际化
const { t } = useI18n();

// 定义人员数据结构
interface Person {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

// 定义结果数据结构
interface CalculationResult {
  overlapAmount: number;
}

// 初始化人员数据
const personA = ref<Person>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

const personB = ref<Person>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

// 自动计算的最小年龄
const minimumAge = computed(() => {
  // 只有当两个人都有年龄信息时，才计算最小值
  if (personA.value.age !== null && personB.value.age !== null) {
    return Math.min(personA.value.age, personB.value.age);
  }
  return null;
});

// 错误提示信息
const errorMessage = ref('');

// 初始化结果数据
const result = ref<CalculationResult>({
  overlapAmount: 0
});

// 结果模态窗口状态
const isResultModalOpen = ref(false);

// 分享模态窗口状态
const isShareModalOpen = ref(false);
const isShareRendering = ref(false);
const sharePreviewUrl = ref('');
const shareRenderTimeout = ref<number | null>(null);
const SHARE_RENDER_DELAY = 2000;

// Canvas引用
const shareCanvas = ref<HTMLCanvasElement | null>(null);

// 重叠百分比（快速计算中默认为0，实际应用中可能需要计算）
const overlapPercentage = ref(0);

// 表单验证
const isFormValid = () => {
  if (!personA.value.weight || !personA.value.height) {
    errorMessage.value = t('计算页面.错误.人员A信息不完整');
    return false;
  }
  if (!personB.value.weight || !personB.value.height) {
    errorMessage.value = t('计算页面.错误.人员B信息不完整');
    return false;
  }
  if (!distanceInput.value) {
    errorMessage.value = t('计算页面.错误.距离未设置');
    return false;
  }
  if (minimumAge.value === null || minimumAge.value <= 0) {
    errorMessage.value = t('计算页面.错误.年龄未计算');
    return false;
  }
  return true
}

// 解析位置坐标字符串为经纬度
function parseLocation(locationStr: string) {
  const [lat, lon] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
  return { lat, lon };
}

// 更新人体 A 数据
const updatePersonA = (newPerson: Person) => {
  // 检查是否与人员B相同
  if (newPerson.name && personB.value.name === newPerson.name) {
    errorMessage.value = t('计算页面.错误.人员重复');
    return;
  }
  personA.value = { ...newPerson };
  errorMessage.value = '';
};
const distanceInput = ref<number>(0);
// 更新人体 B 数据
const updatePersonB = (newPerson: Person) => {
  // 检查是否与人员A相同
  if (newPerson.name && personA.value.name === newPerson.name) {
    errorMessage.value = t('计算页面.错误.人员重复');
    return;
  }
  personB.value = { ...newPerson };
  errorMessage.value = '';
};
// 默认用户A为自己

const db = injectDbService();
db.watchPersons(users => {
  if (!personA.value.name) {
    const self = users.find(u => u.id === 'me');
    if (self) {
      personA.value.name = self.name;
      personA.value.age = self.age;
      personA.value.height = self.height;
      personA.value.weight = self.weight;
      personA.value.location = self.location;
    }
  }
})

watch(() => [personA.value, personB.value], () => {
  // 每当人员数据变化时，重置错误信息
  errorMessage.value = '';
  if (personA.value.location && personB.value.location) {
    const locA = parseLocation(personA.value.location);
    const locB = parseLocation(personB.value.location);
    const distance = calculateDistance(locA, locB);
    distanceInput.value = Math.round(distance);
  }
});

// 计算量子重叠
const calculate = () => {
  if (!isFormValid()) {
    return;
  }

  try {
    // 解析坐标
    const locationA = parseLocation(personA.value.location);
    const locationB = parseLocation(personB.value.location);
    const val = calculateTotalOverlap(
      minimumAge.value!,
      distanceInput.value / 1000
    )
    console.log('计算得到的总重叠量:', val);
    // 执行计算
    const overlapAmount = calculateQuickQuantumOverlap({
      personA: {
        location: locationA,
        weight: personA.value.weight!,
        height: personA.value.height!
      },
      personB: {
        location: locationB,
        weight: personB.value.weight!,
        height: personB.value.height!
      },
      minimumAge: minimumAge.value!,
      distance: distanceInput.value
    });

    // 更新结果并打开结果模态
    result.value.overlapAmount = val.total;
    overlapPercentage.value = val.total / estimateTotalQuantum(personA.value.weight!,); // 确保结果不为负数
    isResultModalOpen.value = true;
  } catch (error) {
    console.error('计算错误:', error);
    alert(t('错误.计算失败'));
  }
};

const resetShareState = () => {
  isShareRendering.value = false;
  sharePreviewUrl.value = '';
  if (shareRenderTimeout.value !== null) {
    window.clearTimeout(shareRenderTimeout.value);
    shareRenderTimeout.value = null;
  }
};

// 打开分享模态窗口
const openShareModal = () => {
  isShareModalOpen.value = true;
  isShareRendering.value = true;
  sharePreviewUrl.value = '';

  if (shareRenderTimeout.value !== null) {
    window.clearTimeout(shareRenderTimeout.value);
  }

  shareRenderTimeout.value = window.setTimeout(() => {
    renderShareCanvas();
    if (shareCanvas.value) {
      sharePreviewUrl.value = canvasToBase64(shareCanvas.value);
    }
    isShareRendering.value = false;
    shareRenderTimeout.value = null;
  }, SHARE_RENDER_DELAY);
};

// 关闭分享模态窗口
const closeShareModal = () => {
  isShareModalOpen.value = false;
  resetShareState();
};

// 关闭结果模态窗口
const closeResultModal = () => {
  isResultModalOpen.value = false;
};

// 绘制分享内容到Canvas
const renderShareCanvas = () => {
  if (!shareCanvas.value) return;

  // 使用默认名称或实际名称
  const personAName = personA.value.name || t('计算页面.人员.A');
  const personBName = personB.value.name || t('计算页面.人员.B');

  // 绘制Canvas内容
  drawShareContent(shareCanvas.value, personAName, personBName, result.value.overlapAmount, estimateTotalQuantum(
    personA.value.weight!
  ));
};

// 从Canvas分享
const shareFromCanvas = () => {
  if (!shareCanvas.value) return;

  const imageUrl = sharePreviewUrl.value || canvasToBase64(shareCanvas.value);

  // 调用系统分享
  shareImage(
    t('分享.标题'),
    t('计算页面.快速.重叠描述'),
    imageUrl,
    () => {
      // 分享成功
      alert(t('分享.已复制'));
      closeShareModal();
    },
    (error) => {
      // 分享失败
      console.error('分享失败:', error);
      alert(t('分享.已复制'));
      closeShareModal();
    }
  );
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
  color: var(--ion-text-color);
  margin: 0 0 8px 0;
  padding: 8px 0;
  text-align: center;
  border-bottom: 1px solid var(--ion-border-color);
}

.result-card {
  margin-top: 16px;
  text-align: center;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-value {
  font-size: 36px;
  font-weight: bold;
  color: var(--ion-color-primary);
  margin: 20px 0;
}

.result-description {
  font-size: 16px;
  color: var(--ion-color-medium);
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
  color: var(--ion-text-color);
  margin-bottom: 4px;
}

.custom-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background-color: var(--ion-item-background, #ffffff);
  color: var(--ion-text-color, #000000);
  border: 1px solid var(--ion-border-color, #e0e0e0);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.custom-input:focus {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb), 0.2);
}

.custom-input::placeholder {
  color: var(--ion-color-medium, #9e9e9e);
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {
  .custom-input {
    background-color: var(--ion-item-background, #1e1e1e);
    color: var(--ion-text-color, #ffffff);
    border-color: var(--ion-border-color, #444444);
  }
}

ion-button {
  margin-top: 0;
}

/* 分享模态窗口样式 */
.share-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.share-canvas {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hidden-canvas {
  display: none;
}

.share-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.share-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-height: 220px;
  justify-content: center;
  text-align: center;
}

.share-progress-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.share-progress-description {
  font-size: 14px;
  color: var(--ion-color-medium);
  max-width: 280px;
}

.distane-edit {
  margin-top: 12px;
}

.share-preview-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.share-preview-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.share-preview-image {
  width: 100%;
  max-width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {
  .share-canvas-container {
    background-color: #1e1e1e;
  }

  .share-canvas {
    border-color: #444444;
  }
}
</style>