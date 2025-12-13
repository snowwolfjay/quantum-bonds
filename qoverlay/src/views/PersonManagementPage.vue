<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ t('人员管理页面.标题') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('人员管理页面.标题') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2" class="content-container">
            <!-- 添加新人员按钮 -->
            <ion-button expand="block" color="primary" @click="addNewPerson" class="add-person-button">
              <ion-icon slot="start" :ios="addCircleOutline" :md="addCircleSharp"></ion-icon>
              {{ t('人员管理页面.添加人员') }}
            </ion-button>

            <!-- 人员列表 -->
            <ion-list>
              <ion-item 
                v-for="(person, index) in persons" 
                :key="index"
                class="person-list-item"
              >
                <ion-avatar slot="start">
                  <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || '?')}&background=random&color=fff&size=64`" />
                </ion-avatar>
                <ion-label>
                  <h2>{{ person.name || t('计算页面.人员.未命名') }}</h2>
                  <p>{{ person.age ? `${person.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.年龄未知') }} | {{ person.height ? `${person.height} cm` : t('计算页面.人员.身高未知') }} | {{ person.weight ? `${person.weight} kg` : t('计算页面.人员.体重未知') }}</p>
                  <p class="location-info">{{ person.location || t('计算页面.人员.位置未知') }}</p>
                </ion-label>
                <ion-buttons slot="end" class="action-buttons">
                  <ion-button color="primary" @click="editPerson(person, index)">
                    {{ t('人员管理页面.编辑') }}
                  </ion-button>
                  <ion-button color="danger" @click="deletePerson(index)">
                    {{ t('人员管理页面.删除') }}
                  </ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>

            <!-- 空状态提示 -->
            <div v-if="persons.length === 0" class="empty-state">
              <ion-icon :ios="personOutline" :md="personSharp" size="large" color="medium"></ion-icon>
              <h3>{{ t('人员管理页面.空状态.标题') }}</h3>
              <p>{{ t('人员管理页面.空状态.描述') }}</p>
              <ion-button expand="block" color="primary" @click="addNewPerson">
                <ion-icon slot="start" :ios="addCircleOutline" :md="addCircleSharp"></ion-icon>
                {{ t('人员管理页面.添加第一个人员') }}
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- 编辑信息模态框 -->
    <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ editingPersonIndex >= 0 ? t('编辑模态框.标题', { title: editingPerson.name || t('计算页面.人员.未命名') }) : t('人员管理页面.添加人员') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">{{ t('编辑模态框.取消') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="modal-content">
          <!-- 称呼输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.称呼') }}</div>
            <ion-input 
              v-model="editingPerson.name" 
              :placeholder="t('编辑模态框.称呼占位符')"
              class="modal-input"
            ></ion-input>
          </div>

          <!-- 年龄输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.年龄') }}</div>
            <ion-input 
              v-model.number="editingPerson.age" 
              type="number" 
              :placeholder="t('编辑模态框.年龄占位符')"
              class="modal-input"
            ></ion-input>
          </div>

          <!-- 位置坐标输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.位置') }}</div>
            <ion-input 
              v-model="editingPerson.location" 
              :placeholder="t('编辑模态框.位置占位符')"
              class="modal-input"
            ></ion-input>
          </div>
          
          <!-- 体重输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.体重') }}</div>
            <ion-input 
              v-model.number="editingPerson.weight" 
              type="number" 
              :placeholder="t('编辑模态框.体重占位符')"
              class="modal-input"
            ></ion-input>
          </div>
          
          <!-- 身高输入 -->
          <div class="input-group">
            <div class="input-label">{{ t('编辑模态框.身高') }}</div>
            <ion-input 
              v-model.number="editingPerson.height" 
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
            <ion-button @click="closeModal" class="footer-button">{{ t('编辑模态框.取消') }}</ion-button>
            <ion-button @click="savePerson" color="primary" class="footer-button">{{ t('编辑模态框.确认') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
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
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonModal,
  IonInput,
  IonIcon,
  IonFooter
} from '@ionic/vue';
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  addCircleOutline, 
  addCircleSharp, 
  personOutline, 
  personSharp 
} from 'ionicons/icons';

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

// 人员列表（模拟数据，后续需要改为全局状态管理）
const persons = ref<Person[]>([
  { name: '张三', location: '39.9042, 116.4074', weight: 70, height: 175, age: 30 },
  { name: '李四', location: '31.2304, 121.4737', weight: 65, height: 170, age: 25 },
  { name: '王五', location: '23.1291, 113.2644', weight: 75, height: 180, age: 35 }
]);

// 模态框状态
const isModalOpen = ref(false);

// 编辑用的人员数据
const editingPerson = reactive<Person>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});
const editingPersonIndex = ref(-1);

// 打开添加新人员模态框
const addNewPerson = () => {
  Object.assign(editingPerson, {
    name: '',
    location: '',
    weight: null,
    height: null,
    age: null
  });
  editingPersonIndex.value = -1;
  isModalOpen.value = true;
};

// 打开编辑人员模态框
const editPerson = (person: Person, index: number) => {
  Object.assign(editingPerson, person);
  editingPersonIndex.value = index;
  isModalOpen.value = true;
};

// 关闭模态框
const closeModal = () => {
  isModalOpen.value = false;
};

// 保存人员信息
const savePerson = () => {
  if (editingPersonIndex.value >= 0) {
    // 更新现有人员
    persons.value[editingPersonIndex.value] = { ...editingPerson };
  } else {
    // 添加新人员
    persons.value.push({ ...editingPerson });
  }
  closeModal();
};

// 删除人员
const deletePerson = (index: number) => {
  if (confirm(t('人员管理页面.确认删除'))) {
    persons.value.splice(index, 1);
  }
};
</script>

<style scoped>
/* 内容容器样式 */
.content-container {
  padding: 20px 0;
}

/* 添加人员按钮样式 */
.add-person-button {
  margin-bottom: 20px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

/* 人员列表样式 */
ion-list {
  margin-bottom: 20px;
}

/* 人员列表项样式 */
.person-list-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 100px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  --background: var(--ion-item-background);
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

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0 0 8px 0;
}

.empty-state p {
  margin-bottom: 20px;
  line-height: 1.6;
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

/* 深色模式样式 */
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
  
  .person-list-item:hover {
    --background: rgba(var(--ion-color-primary-rgb), 0.1);
  }
}
</style>