<template>
  <div class="person-input-component">
    <!-- 展示信息视图 -->
    <div class="person-info-container">
      <div class="person-header">
        <h3 class="person-title">{{ title }}</h3>
        <ion-buttons>
          <ion-button fill="clear" color="primary" @click="openEditModal">
            <ion-icon slot="icon-only" :ios="createOutline" :md="createSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
      </div>
      <div class="person-content">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <div class="info-item">
                <div class="info-label">{{ t('计算页面.人员.坐标') }}</div>
                <div class="info-value">{{ person.location || t('计算页面.人员.未设置') }}</div>
              </div>
            </ion-col>
            <ion-col size="4">
              <div class="info-item">
                <div class="info-label">{{ t('计算页面.人员.体重') }}</div>
                <div class="info-value">{{ person.weight ? `${person.weight} kg` : t('计算页面.人员.未设置') }}</div>
              </div>
            </ion-col>
            <ion-col size="4">
              <div class="info-item">
                <div class="info-label">{{ t('计算页面.人员.身高') }}</div>
                <div class="info-value">{{ person.height ? `${person.height} cm` : t('计算页面.人员.未设置') }}</div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <!-- 编辑信息模态框 -->
    <ion-modal :is-open="isModalOpen" @did-dismiss="closeEditModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('编辑模态框.标题', { title }) }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="modal-content">
          <!-- 位置坐标输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.位置') }}</div>
            <ion-input 
              v-model="editPerson.location" 
              :placeholder="t('编辑模态框.位置占位符')"
              class="modal-input"
            ></ion-input>
          </div>
          
          <!-- 体重输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.体重') }}</div>
            <ion-input 
              v-model.number="editPerson.weight" 
              type="number" 
              :placeholder="t('编辑模态框.体重占位符')"
              class="modal-input"
            ></ion-input>
          </div>
          
          <!-- 身高输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.身高') }}</div>
            <ion-input 
              v-model.number="editPerson.height" 
              type="number" 
              :placeholder="t('编辑模态框.身高占位符')"
              class="modal-input"
            ></ion-input>
          </div>
        </div>
      </ion-content>
      <ion-footer>
        <ion-toolbar class="footer-toolbar">
          <ion-buttons slot="end" class="footer-buttons">
            <ion-button @click="closeEditModal" class="footer-button">{{ t('编辑模态框.取消') }}</ion-button>
            <ion-button @click="confirmEdit" color="primary" class="footer-button">{{ t('编辑模态框.确认') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter
} from '@ionic/vue';
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { createOutline, createSharp } from 'ionicons/icons';

// 国际化
const { t } = useI18n();

// 定义人员数据结构
interface Person {
  location: string;
  weight: number | null;
  height: number | null;
}

// 定义组件属性
const props = defineProps<{
  title: string;
  person: Person;
}>();

// 定义组件事件
const emit = defineEmits<{
  update: [value: Person];
}>();

// 模态框状态
const isModalOpen = ref(false);

// 编辑用的人员数据
const editPerson = reactive<Person>({ ...props.person });

// 监听 props.person 变化，更新编辑数据
watch(() => props.person, (newPerson) => {
  Object.assign(editPerson, newPerson);
}, { deep: true });

// 打开编辑模态框
const openEditModal = () => {
  // 复制当前数据到编辑对象
  Object.assign(editPerson, props.person);
  isModalOpen.value = true;
};

// 关闭编辑模态框
const closeEditModal = () => {
  isModalOpen.value = false;
};

// 确认编辑
const confirmEdit = () => {
  // 发送更新事件
  emit('update', { ...editPerson });
  // 关闭模态框
  closeEditModal();
};
</script>

<style scoped>
.person-input-component {
  margin-bottom: 12px;
}

.person-info-container {
  background-color: var(--ion-card-background-color, #f5f5f5);
  border: 1px solid var(--ion-border-color, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
}

.person-info-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-color: var(--ion-color-primary);
}

.person-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(var(--ion-color-primary-rgb), 0.05);
  border-bottom: 1px solid var(--ion-border-color);
}

.person-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.person-content {
  padding: 12px 16px;
}

ion-grid {
  margin: 0;
  width: 100%;
}

ion-row {
  width: 100%;
}

ion-col {
  padding: 0 6px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6px 0;
}

.info-label {
  font-size: 11px;
  color: var(--ion-color-medium);
  margin-bottom: 3px;
}

.info-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--ion-text-color);
  word-break: break-word;
}

ion-button {
  --padding-start: 0;
  --padding-end: 0;
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {
  .person-info-container {
    background-color: var(--ion-card-background-color, #1e1e1e);
    border-color: var(--ion-border-color, #444444);
  }
  
  .person-header {
    background-color: rgba(var(--ion-color-primary-rgb), 0.1);
  }
}

/* 模态框样式 */
.modal-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-text-color, #000000);
  text-align: center;
  margin-bottom: 4px;
}

.modal-input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  background-color: var(--ion-item-background, #ffffff);
  color: var(--ion-text-color, #000000);
  border: 1px solid var(--ion-border-color, #e0e0e0);
  border-radius: 12px;
  outline: none;
  transition: all 0.2s ease;
  text-align: center;
  box-sizing: border-box;
  --placeholder-color: var(--ion-color-medium, #9e9e9e);
}

.modal-input:focus {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb), 0.2);
}

/* 底部工具栏样式 */
.footer-toolbar {
  --background: var(--ion-footer-background, var(--ion-background-color));
  --border-color: var(--ion-border-color);
  padding: 12px 20px;
}

.footer-buttons {
  display: flex;
  gap: 12px;
}

.footer-button {
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  min-width: 100px;
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --border-radius: 8px;
}

/* 模态框深色模式样式 */
@media (prefers-color-scheme: dark) {
  .input-label {
    color: var(--ion-text-color, #ffffff);
  }
  
  .modal-input {
    background-color: var(--ion-item-background, #1e1e1e);
    color: var(--ion-text-color, #ffffff);
    border-color: var(--ion-border-color, #444444);
    --placeholder-color: var(--ion-color-medium, #9e9e9e);
  }
  
  .footer-toolbar {
    --background: var(--ion-footer-background, #1e1e1e);
    --border-color: var(--ion-border-color, #444444);
  }
}
</style>