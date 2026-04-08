<template>
  <div class="person-input-component">
    <div class="person-card">
      <div class="person-card-header">
        <div>
          <h3 class="person-title">{{ title }}</h3>
          <div class="person-subtitle">
            {{ isPersonSelected ? t('计算页面.人员.已录入') : t('计算页面.人员.未设置提示') }}
          </div>
        </div>
        <ion-button fill="clear" color="primary" @click.stop="openPersonSelectModal">
          <ion-icon slot="icon-only" :ios="isSelectedPersion ? repeatOutline : personAddOutline"
            :md="personAddSharp"></ion-icon>
        </ion-button>
      </div>

      <div class="person-card-body" @click="openPersonEditModal">
        <div class="person-overview">
          <div class="info-label">{{ t('计算页面.人员.称呼') }}</div>
          <div class="info-value">{{ props.person.name || t('计算页面.人员.未设置') }}</div>
        </div>
        <div class="person-overview">
          <div class="info-label">{{ t('计算页面.人员.年龄') }}</div>
          <div class="info-value">{{ props.person.age != null ? `${props.person.age} ${t('计算页面.人员.岁')}` :
            t('计算页面.人员.未设置') }}</div>
        </div>
      </div>
    </div>

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
          <PersonListComponent mode="select" :selectedPerson="props.person" @select="selectPerson" />
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="isPersonEditModalOpen" @did-dismiss="closePersonEditModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('计算页面.人员.录入信息') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closePersonEditModal">{{ t('编辑模态框.取消') }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="modal-content">
          <div class="input-group">
            <label class="input-label">{{ t('编辑模态框.称呼') }}</label>
            <ion-input class="modal-input" v-model="editPerson.name" :placeholder="t('编辑模态框.称呼占位符')" :maxlength="50" />
          </div>
          <div class="input-group">
            <label class="input-label">{{ t('编辑模态框.年龄') }}</label>
            <ion-input class="modal-input" v-model.number="editPerson.age" type="number" inputmode="numeric" min="0"
              :placeholder="t('编辑模态框.年龄占位符')" />
          </div>
          <div class="footer-toolbar">
            <div class="footer-buttons">
              <ion-button fill="outline" class="footer-button" @click="closePersonEditModal">
                {{ t('编辑模态框.取消') }}
              </ion-button>
              <ion-button class="footer-button" color="primary" @click="savePersonInput">
                {{ t('编辑模态框.确认') }}
              </ion-button>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonModal,
  IonHeader,
  IonButton,
  IonToolbar,
  IonButtons,
  IonContent,
  IonTitle,
  IonInput
} from '@ionic/vue';
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  personAddOutline,
  personAddSharp,
  repeatOutline
} from 'ionicons/icons';
import { Person } from '../services/dbService';
import PersonListComponent from './PersonListComponent.vue';

const { t } = useI18n();

const props = defineProps<{
  title: string;
  person: Omit<Person, 'id'> & { id?: string };
}>();

const emit = defineEmits<{
  update: [value: Omit<Person, 'id'>];
}>();

const router = useRouter();
const isPersonSelectModalOpen = ref(false);
const isPersonEditModalOpen = ref(false);
const editPerson = ref<{ name: string; age: number | null }>({ name: '', age: null });
const isSelectedPersion = computed(() => props.person.id)
const isPersonSelected = computed(() => {
  return !!props.person.name || props.person.age != null;
});

const goToPersonManagement = () => {
  router.replace('/persons');
};

const openPersonSelectModal = () => {
  isPersonSelectModalOpen.value = true;
};

const closePersonSelectModal = () => {
  isPersonSelectModalOpen.value = false;
};

const openPersonEditModal = () => {
  editPerson.value = {
    name: props.person.name || '',
    age: props.person.age ?? null
  };
  isPersonEditModalOpen.value = true;
};

const closePersonEditModal = () => {
  isPersonEditModalOpen.value = false;
};

const savePersonInput = () => {
  emit('update', {
    ...props.person,
    name: editPerson.value.name?.trim() || '',
    age: editPerson.value.age
  });
  closePersonEditModal();
};

const selectPerson = (p: Person) => {
  const { id, ...personData } = p;
  emit('update', {...p});
  closePersonSelectModal();
};

onUnmounted(() => {
  isPersonSelectModalOpen.value = false;
  isPersonEditModalOpen.value = false;
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

/* 人员选择模态框样式 */
.person-select-modal {
  max-width: 600px;
  margin: 0 auto;
}

.person-card {
  border: 1px solid var(--ion-border-color, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
}

.person-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(var(--ion-color-primary-rgb), 0.05);
  border-bottom: 1px solid var(--ion-border-color);
}

.person-card-body {
  padding: 0 16px 16px;
}


.person-subtitle {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 4px;
}

.person-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--ion-border-color);
}

.person-overview:last-child {
  border-bottom: none;
}

.location-info {
  font-size: 12px !important;
  color: var(--ion-color-medium) !important;
  margin-top: 2px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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