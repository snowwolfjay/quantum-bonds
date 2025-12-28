<template>
  <view class="persons-page">
    <view class="content-container">
      <button class="add-person-button" @click="addNewPerson">
        <text class="button-icon">➕</text>
        {{ t("人员管理页面.添加人员") }}
      </button>

      <view class="persons-list">
        <view
          class="person-item"
          v-for="person in persons"
          :key="person.id"
        >
          <image class="person-avatar" :src="getAvatarUrl(person.name)" mode="aspectFill" />
          <view class="person-info">
            <view class="person-name">{{ person.name || t("计算页面.人员.未命名") }}</view>
            <view class="person-details">
              {{
                person.age
                  ? `${person.age} ${t("计算页面.人员.岁")}`
                  : t("计算页面.人员.年龄未知")
              }}
              |
              {{
                person.height
                  ? `${person.height} cm`
                  : t("计算页面.人员.身高未知")
              }}
              |
              {{
                person.weight
                  ? `${person.weight} kg`
                  : t("计算页面.人员.体重未知")
              }}
            </view>
            <view class="person-location">{{ person.location || t("计算页面.人员.位置未知") }}</view>
          </view>
          <view class="person-actions">
            <button class="action-button" @click="editPerson(person)">
              {{ t("人员管理页面.编辑") }}
            </button>
          </view>
        </view>
      </view>

      <view v-if="persons.length === 0" class="empty-state">
        <text class="empty-icon">👤</text>
        <view class="empty-title">{{ t("人员管理页面.空状态.标题") }}</view>
        <view class="empty-description">{{ t("人员管理页面.空状态.描述") }}</view>
        <button class="add-person-button" @click="addNewPerson">
          <text class="button-icon">➕</text>
          {{ t("人员管理页面.添加第一个人员") }}
        </button>
      </view>
    </view>

    <uni-popup ref="editPopup" type="center">
      <view class="edit-modal-content">
        <view class="modal-header">
          <view class="modal-title">{{
            editingPersonId
              ? t("编辑模态框.标题", { title: editingPerson.name || t("计算页面.人员.未命名") })
              : t("人员管理页面.添加人员")
          }}</view>
          <button class="close-button" @click="closeModal">✕</button>
        </view>
        <view class="modal-body">
          <info-input-component
            ref="infoInputRef"
            v-model="editingPerson"
            :touched="isTouched"
            @reset-touched="isTouched = false"
          ></info-input-component>
        </view>
        <view class="modal-footer">
          <button class="footer-button cancel" @click="closeModal">
            {{ t("编辑模态框.取消") }}
          </button>
          <button class="footer-button confirm" @click="savePerson">
            {{ t("编辑模态框.确认") }}
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dbService from '../../services/dbService';
import { defaultPerson } from '../../config/defaultPerson';
import InfoInputComponent from '../../components/InfoInputComponent.vue';

interface Person {
  id: string;
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

interface PersonData {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

const { t } = useI18n();
const persons = ref<Person[]>([]);
const editPopup = ref();
const infoInputRef = ref();

const editingPerson = ref<PersonData>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

const editingPersonId = ref<string | null>(null);
const isTouched = ref(false);

const initData = async (): Promise<void> => {
  try {
    const dbPersons = await dbService.getAllPersons();
    persons.value = dbPersons.filter(
      (person: Person) => person.id !== defaultPerson.id
    );
  } catch (error) {
    console.error('Failed to initialize data:', error);
    uni.showToast({
      title: t("错误.计算失败"),
      icon: 'none'
    });
  }
};

const addNewPerson = (): void => {
  Object.assign(editingPerson.value, {
    name: '',
    location: '',
    weight: null,
    height: null,
    age: null
  });
  editingPersonId.value = null;
  editPopup.value?.open();
};

const editPerson = (person: Person): void => {
  Object.assign(editingPerson.value, { ...person });
  editingPersonId.value = person.id;
  editPopup.value?.open();
};

const closeModal = (): void => {
  editPopup.value?.close();
};

const validateForm = (): boolean => {
  return infoInputRef.value?.validateForm(editingPerson.value);
};

const savePerson = async (): Promise<void> => {
  isTouched.value = true;
  if (!validateForm()) {
    return;
  }

  try {
    if (editingPersonId.value) {
      await dbService.updatePerson({
        id: editingPersonId.value,
        ...editingPerson.value
      });
    } else {
      await dbService.addPerson(editingPerson.value);
    }
    closeModal();
    await initData();
  } catch (error) {
    console.error('Failed to save person:', error);
    uni.showToast({
      title: t("错误.计算失败"),
      icon: 'none'
    });
  }
};

const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=random&color=fff&size=64`;
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.persons-page {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.content-container {
  padding: 20px;
}

.add-person-button {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
  margin-bottom: 20px;
}

.button-icon {
  font-size: 20px;
}

.persons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.person-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.person-item:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.person-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.person-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.person-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.person-details {
  font-size: 14px;
  color: #999;
}

.person-location {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-actions {
  flex-shrink: 0;
}

.action-button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #007AFF;
  color: #ffffff;
  border: none;
  border-radius: 6px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.edit-modal-content {
  width: 500rpx;
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

.modal-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.footer-button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}

.footer-button.cancel {
  background-color: #f5f5f5;
  color: #333;
}

.footer-button.confirm {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
}
</style>
