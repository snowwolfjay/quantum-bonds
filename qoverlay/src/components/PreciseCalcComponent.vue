<template>
  <div class="precise-calc-container">
    <!-- 输入部分 -->
    <div class="input-section">
      <h2 class="section-title">{{ t('计算页面.精确.副标题') }}</h2>
      
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
        {{ t('计算页面.精确.计算') }}
      </ion-button>
    </div>

  <!-- 结果展示部分 -->
  <div v-if="showResult" class="result-section">
    <!-- 精算结果 -->
    <ion-item-divider>
      <ion-label>{{ t('计算页面.精确.结果') }}</ion-label>
    </ion-item-divider>
    
    <ion-card class="result-card">
      <ion-card-header>
        <ion-card-title>{{ t('计算页面.精确.重叠数量') }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <!-- 累计量子重叠数量 -->
        <div class="result-section">
          <h3>{{ t('计算页面.精确.重叠数量') }}</h3>
          <div class="result-value">{{ result.overlapAmount.toExponential(2) }}</div>
        </div>

        <!-- 量子重叠百分比 -->
        <div class="result-section">
          <h3>{{ t('计算页面.精确.重叠百分比') }}</h3>
          <div class="result-value">{{ (result.overlapPercentage * 100).toFixed(4) }}%</div>
          <div class="result-description">
            {{ t('计算页面.精确.重叠百分比描述') }}
          </div>
        </div>

        <!-- 不同传播方式的量子扩散抵达率 -->
        <div class="result-section">
          <h3>{{ t('计算页面.精确.传播方式抵达率') }}</h3>
          <ion-list>
            <ion-item v-for="(rate, method) in result.transmissionRates" :key="method">
              <ion-label>{{ getTransmissionMethodName(method) }}</ion-label>
              <ion-note slot="end">{{ (rate * 100).toFixed(4) }}%</ion-note>
            </ion-item>
          </ion-list>
        </div>

        <!-- 不同量子类型的扩散抵达率 -->
        <div class="result-section">
          <h3>{{ t('计算页面.精确.量子类型抵达率') }}</h3>
          <ion-list>
            <ion-item v-for="(rate, type) in result.quantumTypeRates" :key="type">
              <ion-label>{{ getQuantumTypeName(type) }}</ion-label>
              <ion-note slot="end">{{ (rate * 100).toFixed(4) }}%</ion-note>
            </ion-item>
          </ion-list>
        </div>
      </ion-card-content>
    </ion-card>

    <!-- 分享设置 -->
    <ion-item-divider>
      <ion-label>{{ t('计算页面.精确.分享设置') }}</ion-label>
    </ion-item-divider>
    
    <ion-card class="share-settings-card">
      <ion-card-content>
        <ion-list>
          <ion-item>
            <ion-label>{{ t('计算页面.精确.选择结果展示') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-checkbox v-model="shareSettings.showOverlapAmount"></ion-checkbox>
            <ion-label>{{ t('计算页面.精确.重叠数量') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-checkbox v-model="shareSettings.showOverlapPercentage"></ion-checkbox>
            <ion-label>{{ t('计算页面.精确.重叠百分比') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-checkbox v-model="shareSettings.showTransmissionRates"></ion-checkbox>
            <ion-label>{{ t('计算页面.精确.传播方式抵达率') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-checkbox v-model="shareSettings.showQuantumTypeRates"></ion-checkbox>
            <ion-label>{{ t('计算页面.精确.量子类型抵达率') }}</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-label>{{ t('计算页面.精确.选择配色方案') }}</ion-label>
            <ion-select v-model="shareSettings.colorScheme" :placeholder="t('颜色方案.默认')">
              <ion-select-option value="default">{{ t('颜色方案.默认') }}</ion-select-option>
              <ion-select-option value="blue">{{ t('颜色方案.蓝色') }}</ion-select-option>
              <ion-select-option value="green">{{ t('颜色方案.绿色') }}</ion-select-option>
              <ion-select-option value="purple">{{ t('颜色方案.紫色') }}</ion-select-option>
              <ion-select-option value="red">{{ t('颜色方案.红色') }}</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <!-- 分享按钮 -->
    <ion-button expand="block" color="secondary" @click="openShareModal">
      <ion-icon slot="start" :ios="shareOutline" :md="shareSharp"></ion-icon>
      {{ t('计算页面.精确.分享定制结果') }}
    </ion-button>

    <!-- 分享模态窗口 -->
    <ion-modal :is-open="isShareModalOpen" @did-dismiss="closeShareModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('计算页面.精确.分享定制结果') }}</ion-title>
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
            {{ t('计算页面.精确.分享定制结果') }}
          </ion-button>
          <ion-button expand="block" @click="closeShareModal">
            {{ t('编辑模态框.取消') }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
      </ion-card-content>
    </ion-card>
  </div>
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
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonToolbar,
  IonButtons
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { shareOutline, shareSharp } from 'ionicons/icons';
import { calculatePreciseQuantumOverlap } from '../utils/preciseCalc';
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
interface PreciseCalcResult {
  overlapAmount: number;
  overlapPercentage: number;
  transmissionRates: Record<string, number>;
  quantumTypeRates: Record<string, number>;
}

// 定义分享设置数据结构
interface ShareSettings {
  showOverlapAmount: boolean;
  showOverlapPercentage: boolean;
  showTransmissionRates: boolean;
  showQuantumTypeRates: boolean;
  colorScheme: string;
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

// 更新人体 A 数据
const updatePersonA = (newPerson: Person) => {
  personA.value = { ...newPerson };
};

// 更新人体 B 数据
const updatePersonB = (newPerson: Person) => {
  personB.value = { ...newPerson };
};

// 最小年龄输入
const minimumAge = ref<number | null>(null);

// 初始化结果数据
const showResult = ref(false);
const result = ref<PreciseCalcResult>({
  overlapAmount: 0,
  overlapPercentage: 0,
  transmissionRates: {
    respiration: 0,
    evaporation: 0,
    thermalMotion: 0,
    externalForce: 0,
    quantumTransition: 0
  },
  quantumTypeRates: {
    water: 0,
    oxygen: 0,
    other: 0
  }
});

// 初始化分享设置
const shareSettings = ref<ShareSettings>({
  showOverlapAmount: true,
  showOverlapPercentage: true,
  showTransmissionRates: true,
  showQuantumTypeRates: true,
  colorScheme: 'default'
});

// 分享模态窗口状态
const isShareModalOpen = ref(false);

// Canvas引用
const shareCanvas = ref<HTMLCanvasElement | null>(null);

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

// 获取传播方式名称
function getTransmissionMethodName(method: string): string {
  return t(`传输方式.${method}`) as string;
}

// 获取量子类型名称
function getQuantumTypeName(type: string): string {
  return t(`量子类型.${type}`) as string;
}

// 解析位置坐标字符串为经纬度
function parseLocation(locationStr: string) {
  const [lat, lon] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
  return { lat, lon };
}

// 计算量子重叠
const calculate = () => {
  if (!isFormValid.value) return;
  
  try {
    // 解析坐标
    const locationA = parseLocation(personA.value.location);
    const locationB = parseLocation(personB.value.location);
    
    // 执行计算
    const calculationResult = calculatePreciseQuantumOverlap({
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
    result.value = calculationResult;
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
  drawShareContent(shareCanvas.value, personAName, personBName, result.value.overlapAmount, result.value.overlapPercentage);
};

// 从Canvas分享
const shareFromCanvas = () => {
  if (!shareCanvas.value) return;
  
  // 将Canvas转换为base64
  const imageUrl = canvasToBase64(shareCanvas.value);
  
  // 调用系统分享
  shareImage(
    t('分享.标题'),
    t('计算页面.精确.重叠描述'),
    imageUrl,
    () => {
      // 分享成功
      alert(t('分享.已复制定制'));
      closeShareModal();
    },
    (error) => {
      // 分享失败
      console.error('分享失败:', error);
      alert(t('分享.已复制定制'));
      closeShareModal();
    }
  );
};
</script>

<style scoped>
.precise-calc-container {
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
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-section .result-section {
  margin-bottom: 30px;
}

.result-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--ion-color-primary);
}

.result-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--ion-color-primary);
  margin: 10px 0;
  text-align: center;
}

.result-description {
  font-size: 14px;
  color: var(--ion-color-medium);
  text-align: center;
  margin-bottom: 15px;
}

/* 最小年龄输入样式 */
.minimum-age-section {
  margin: 12px 0 16px 0;
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

.share-settings-card {
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