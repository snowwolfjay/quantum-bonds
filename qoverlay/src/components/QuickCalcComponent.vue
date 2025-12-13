<template>
  <div class="quick-calc-container">
    <!-- 输入部分 -->
    <div class="input-section">
      <h2 class="section-title">{{ t('计算页面.快速.副标题') }}</h2>
      
      <!-- 人体 A 输入组件 -->
      <PersonInputComponent 
        :title="t('计算页面.人员.A')" 
        :person="personA" 
        @update="updatePersonA" 
      />

      <!-- 人体 B 输入组件 -->
      <PersonInputComponent 
        :title="t('计算页面.人员.B')" 
        :person="personB" 
        @update="updatePersonB" 
      />

      <!-- 自动计算的最小年龄显示 -->
      <div class="minimum-age-section">
        <div class="input-container">
          <label class="input-label">{{ t('计算页面.最小年龄') }}</label>
          <div class="auto-calculated-age" :class="{ 'age-not-calculated': !minimumAge }">
            {{ minimumAge ? `${minimumAge} ${t('计算页面.人员.岁')}` : t('计算页面.错误.年龄未计算') }}
          </div>
        </div>
      </div>

      <!-- 错误信息显示 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- 计算按钮 -->
      <ion-button expand="block" color="primary" @click="calculate" :disabled="!isFormValid">
        {{ t('计算页面.快速.计算') }}
      </ion-button>
    </div>

    <!-- 结果展示部分 -->
    <div v-if="showResult" class="result-section">
      <ion-item-divider>
        <ion-label>{{ t('计算页面.快速.结果') }}</ion-label>
      </ion-item-divider>
      
      <ion-card class="result-card">
        <ion-card-header>
          <ion-card-title>{{ t('计算页面.快速.重叠数量') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="result-value">{{ result.overlapAmount.toExponential(2) }}</div>
          <div class="result-description">
            {{ t('计算页面.快速.重叠描述') }}
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 分享按钮 -->
      <ion-button expand="block" color="secondary" @click="openShareModal">
        <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
        {{ t('计算页面.快速.分享') }}
      </ion-button>
    </div>

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
        <!-- Canvas 容器 -->
        <div class="share-canvas-container">
          <canvas 
            ref="shareCanvas" 
            width="600" 
            height="300" 
            class="share-canvas"
          ></canvas>
        </div>

        <!-- 操作按钮 -->
        <div class="share-actions">
          <ion-button expand="block" color="primary" @click="shareFromCanvas">
            <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
            {{ t('计算页面.快速.分享') }}
          </ion-button>
          <ion-button expand="block" @click="closeShareModal">
            {{ t('编辑模态框.取消') }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal,
  IonToolbar,
  IonButtons,
  IonHeader,
  IonTitle,
  IonContent
} from '@ionic/vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { shareOutline, shareSharp } from 'ionicons/icons';
import { calculateQuickQuantumOverlap } from '../utils/quickCalc';
import { drawShareContent, canvasToBase64, shareImage } from '../utils/shareUtils';
import PersonInputComponent from './PersonInputComponent.vue';

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
const showResult = ref(false);
const result = ref<CalculationResult>({
  overlapAmount: 0
});

// 分享模态窗口状态
const isShareModalOpen = ref(false);

// Canvas引用
const shareCanvas = ref<HTMLCanvasElement | null>(null);

// 重叠百分比（快速计算中默认为0，实际应用中可能需要计算）
const overlapPercentage = ref(0);

// 表单验证
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

// 计算量子重叠
const calculate = () => {
  if (!isFormValid.value) return;
  
  try {
    // 解析坐标
    const locationA = parseLocation(personA.value.location);
    const locationB = parseLocation(personB.value.location);
    
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
      minimumAge: minimumAge.value!
    });
    
    // 更新结果
    result.value.overlapAmount = overlapAmount;
    showResult.value = true;
  } catch (error) {
    console.error('计算错误:', error);
    alert(t('错误.计算失败'));
  }
};

// 打开分享模态窗口
const openShareModal = () => {
  isShareModalOpen.value = true;
  // 延迟绘制，确保Canvas已经渲染
  setTimeout(() => {
    renderShareCanvas();
  }, 100);
};

// 关闭分享模态窗口
const closeShareModal = () => {
  isShareModalOpen.value = false;
};

// 绘制分享内容到Canvas
const renderShareCanvas = () => {
  if (!shareCanvas.value) return;
  
  // 使用默认名称或实际名称
  const personAName = personA.value.name || t('计算页面.人员.A');
  const personBName = personB.value.name || t('计算页面.人员.B');
  
  // 绘制Canvas内容
  drawShareContent(shareCanvas.value, personAName, personBName, result.value.overlapAmount, overlapPercentage.value);
};

// 从Canvas分享
const shareFromCanvas = () => {
  if (!shareCanvas.value) return;
  
  // 将Canvas转换为base64
  const imageUrl = canvasToBase64(shareCanvas.value);
  
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