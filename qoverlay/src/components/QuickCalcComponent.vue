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

      <!-- 最小年龄输入 -->
      <div class="minimum-age-section">
        <div class="input-container">
          <label class="input-label">{{ t('计算页面.最小年龄') }}</label>
          <input 
            type="number" 
            v-model.number="minimumAge" 
            :placeholder="t('计算页面.最小年龄占位符')" 
            class="custom-input"
          />
        </div>
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
      <ion-button expand="block" color="secondary" @click="share">
        <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
        {{ t('计算页面.快速.分享') }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { shareOutline, shareSharp } from 'ionicons/icons';
import { calculateQuickQuantumOverlap } from '../utils/quickCalc';
import PersonInputComponent from './PersonInputComponent.vue';

// 国际化
const { t } = useI18n();

// 定义人员数据结构
interface Person {
  location: string;
  weight: number | null;
  height: number | null;
}

// 定义结果数据结构
interface CalculationResult {
  overlapAmount: number;
}

// 初始化人员数据
const personA = ref<Person>({
  location: '',
  weight: null,
  height: null
});

const personB = ref<Person>({
  location: '',
  weight: null,
  height: null
});

// 最小年龄输入
const minimumAge = ref<number | null>(null);

// 初始化结果数据
const showResult = ref(false);
const result = ref<CalculationResult>({
  overlapAmount: 0
});

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
  personA.value = { ...newPerson };
};

// 更新人体 B 数据
const updatePersonB = (newPerson: Person) => {
  personB.value = { ...newPerson };
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

// 分享功能
const share = () => {
  // 简单的分享实现
  const shareText = `${t('计算页面.快速.重叠描述')}: ${result.value.overlapAmount.toExponential(2)}`;
  
  if (navigator.share) {
    navigator.share({
      title: t('分享.标题'),
      text: shareText,
      url: window.location.href
    });
  } else {
    // 回退方案：复制到剪贴板
    navigator.clipboard.writeText(shareText);
    alert(t('分享.已复制'));
  }
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
</style>