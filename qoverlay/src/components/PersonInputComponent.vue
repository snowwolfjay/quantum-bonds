<template>
  <div class="person-input-component">
    <!-- 选择人员按钮 -->
    <div class="person-select-container" v-if="!isPersonSelected">
      <h3 class="person-title">{{ title }}</h3>
      <ion-button expand="block" color="primary" @click="openPersonSelectModal">
        <ion-icon slot="start" :ios="personOutline" :md="personSharp"></ion-icon>
        {{ t('计算页面.人员.选择') }}
      </ion-button>
    </div>

    <!-- 展示信息视图 -->
    <div class="person-info-container" v-else>
      <div class="person-header">
        <h3 class="person-title">{{ title }}</h3>
        <ion-buttons>
          <ion-button fill="clear" color="primary" @click="openPersonSelectModal">
            <ion-icon slot="icon-only" :ios="personOutline" :md="personSharp"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="primary" @click="goToPersonManagement">
            <ion-icon slot="icon-only" :ios="settingsOutline" :md="settingsSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
      </div>
      <div class="person-content">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <div class="info-item">
                <div class="info-label">{{ t('计算页面.人员.称呼') }}</div>
                <div class="info-value">{{ person.name || t('计算页面.人员.未设置') }}</div>
              </div>
            </ion-col>
            <ion-col size="4">
              <div class="info-item">
                <div class="info-label">{{ t('计算页面.人员.年龄') }}</div>
                <div class="info-value">{{ person.age ? `${person.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.未设置') }}</div>
              </div>
            </ion-col>
          </ion-row>
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

    <!-- 人员选择模态框 -->
    <ion-modal :is-open="isPersonSelectModalOpen" @did-dismiss="closePersonSelectModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('计算页面.人员.选择') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closePersonSelectModal">{{ t('编辑模态框.取消') }}</ion-button>
            <ion-button color="secondary" @click="goToPersonManagement">{{ t('计算页面.人员.管理') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="person-select-modal">
          <!-- 人员列表 -->
          <h3 class="section-title">{{ t('计算页面.人员.现有人员') }}</h3>
          <ion-list>
            <ion-item 
              v-for="p in persons" 
              :key="p.id"
              @click="selectPerson(p)"
              class="person-list-item"
            >
              <ion-avatar slot="start">
                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || '?')}&background=random&color=fff&size=64`" />
              </ion-avatar>
              <ion-label>
                <h2>{{ p.name || t('计算页面.人员.未命名') }}</h2>
                <p>{{ p.age ? `${p.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.年龄未知') }} | {{ p.height ? `${p.height} cm` : t('计算页面.人员.身高未知') }} | {{ p.weight ? `${p.weight} kg` : t('计算页面.人员.体重未知') }}</p>
                <p class="location-info">{{ p.location || t('计算页面.人员.位置未知') }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ion-content>
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
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar
} from '@ionic/vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { 
  personOutline, 
  personSharp, 
  settingsOutline, 
  settingsSharp 
} from 'ionicons/icons';
import { injectDbService, Person } from '../services/dbService';
import { defaultPerson } from '../config/defaultPerson';

// 国际化
const { t } = useI18n();

// 定义组件属性
const props = defineProps<{
  title: string;
  person: Omit<Person, 'id'>;
}>();

// 定义组件事件
const emit = defineEmits<{
  update: [value: Omit<Person, 'id'>];
}>();

// 路由
const router = useRouter();

// 人员列表管理
const persons = ref<Person[]>([]);

// 模态框状态
const isPersonSelectModalOpen = ref(false);

// 取消订阅函数
let unsubscribeFromPersons: (() => void) | null = null;

// 判断是否已选择人员
const isPersonSelected = computed(() => {
  return !!props.person.name || !!props.person.location || props.person.weight || props.person.height || props.person.age;
});

// 获取数据库服务实例
const dbService = injectDbService();

// 初始化数据
const initData = async () => {
  try {
    // 加载初始数据
    const dbPersons = await dbService.getAllPersons();
    // 添加默认人员
    persons.value = [defaultPerson, ...dbPersons.filter(person => person.id !== defaultPerson.id)];
    
    // 监听数据变化
    unsubscribeFromPersons = await dbService.watchPersons((newPersons) => {
      // 当数据变化时，重新添加默认人员
      persons.value = [defaultPerson, ...newPersons.filter(person => person.id !== defaultPerson.id)];
    });
  } catch (error) {
    console.error('Failed to load persons:', error);
  }
};

// 跳转到人员管理页面
const goToPersonManagement = () => {
  router.replace('/persons');
};

// 打开人员选择模态框
const openPersonSelectModal = () => {
  isPersonSelectModalOpen.value = true;
};

// 关闭人员选择模态框
const closePersonSelectModal = () => {
  isPersonSelectModalOpen.value = false;
};

// 选择人员
const selectPerson = (p: Person) => {
  // 移除id属性，只传递需要的字段
  const { id, ...personData } = p;
  emit('update', personData);
  closePersonSelectModal();
};

// 组件挂载时初始化数据
onMounted(() => {
  initData();
});

// 组件卸载时清理
onUnmounted(() => {
  if (unsubscribeFromPersons) {
    unsubscribeFromPersons();
    unsubscribeFromPersons = null;
  }
  isPersonSelectModalOpen.value = false;
});
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

/* 人员选择容器样式 */
.person-select-container {
  background-color: var(--ion-card-background-color, #f5f5f5);
  border: 1px solid var(--ion-border-color, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 12px;
  text-align: center;
  transition: all 0.2s ease;
}

.person-select-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-color: var(--ion-color-primary);
}

/* 人员选择模态框样式 */
.person-select-modal {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-primary);
  margin-bottom: 20px;
  text-align: center;
}

/* 人员列表项样式 */
.person-list-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 80px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.person-list-item:hover {
  --background: rgba(var(--ion-color-primary-rgb), 0.05);
}

.person-list-item ion-label h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.person-list-item ion-label p {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 4px 0;
}

.location-info {
  font-size: 12px !important;
  color: var(--ion-color-medium) !important;
  margin-top: 2px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 添加人员按钮样式 */
.add-person-button {
  margin-top: 20px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

/* 深色模式下的人员选择容器 */
@media (prefers-color-scheme: dark) {
  .person-select-container {
    background-color: var(--ion-card-background-color, #1e1e1e);
    border-color: var(--ion-border-color, #444444);
  }
  
  .person-list-item:hover {
    --background: rgba(var(--ion-color-primary-rgb), 0.1);
  }
}
</style>