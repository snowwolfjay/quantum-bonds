<template>
  <view class="person-input-component">
    <view class="person-select-container" v-if="!isPersonSelected">
      <view class="person-title">{{ title }}</view>
      <button class="select-button" @click="openPersonSelectModal">
        <text class="button-icon">👤</text>
        <text>{{ t('计算页面.人员.选择') }}</text>
      </button>
    </view>

    <view class="person-info-container" v-else>
      <view class="person-header">
        <view class="person-title">{{ title }}</view>
        <view class="header-buttons">
          <button class="icon-button" @click="openPersonSelectModal">👤</button>
          <button class="icon-button" @click="goToPersonManagement">⚙️</button>
        </view>
      </view>
      <view class="person-content">
        <view class="info-row">
          <view class="info-item">
            <view class="info-label">{{ t('计算页面.人员.称呼') }}</view>
            <view class="info-value">{{ person.name || t('计算页面.人员.未设置') }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">{{ t('计算页面.人员.年龄') }}</view>
            <view class="info-value">{{ person.age ? `${person.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.未设置') }}</view>
          </view>
        </view>
        <view class="info-row">
          <view class="info-item">
            <view class="info-label">{{ t('计算页面.人员.坐标') }}</view>
            <view class="info-value">{{ person.location || t('计算页面.人员.未设置') }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">{{ t('计算页面.人员.体重') }}</view>
            <view class="info-value">{{ person.weight ? `${person.weight} kg` : t('计算页面.人员.未设置') }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">{{ t('计算页面.人员.身高') }}</view>
            <view class="info-value">{{ person.height ? `${person.height} cm` : t('计算页面.人员.未设置') }}</view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="personSelectPopup" type="center">
      <view class="person-select-modal">
        <view class="modal-header">
          <view class="modal-title">{{ t('计算页面.人员.选择') }}</view>
          <view class="header-actions">
            <button class="text-button" @click="closePersonSelectModal">{{ t('编辑模态框.取消') }}</button>
            <button class="text-button primary" @click="goToPersonManagement">{{ t('计算页面.人员.管理') }}</button>
          </view>
        </view>
        <scroll-view scroll-y class="person-list">
        <!--  <view class="section-title">{{ t('计算页面.人员.现有人员') }}</view> -->
          <view
            class="person-list-item"
            v-for="p in persons"
            :key="p.id"
            @click="selectPerson(p)"
          >
            <!-- <image class="person-avatar" :src="getAvatarUrl(p.name)" mode="aspectFill" /> -->
            <view class="person-info">
              <view class="person-name">{{ p.name || t('计算页面.人员.未命名') }}</view>
              <view class="person-details">
                {{ p.age ? `${p.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.年龄未知') }} | 
                {{ p.height ? `${p.height} cm` : t('计算页面.人员.身高未知') }} | 
                {{ p.weight ? `${p.weight} kg` : t('计算页面.人员.体重未知') }}
              </view>
              <view class="person-location">{{ p.location || t('计算页面.人员.位置未知') }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dbService from '../services/dbService';
import { defaultPerson } from '../config/defaultPerson';

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

const props = defineProps<{
  title: string;
  person: PersonData;
}>();

const emit = defineEmits<{
  (e: 'update', data: PersonData): void;
}>();

const { t } = useI18n();
const persons = ref<Person[]>([]);
const personSelectPopup = ref();

const isPersonSelected = computed(() => {
  return !!props.person.name || !!props.person.location || props.person.weight || props.person.height || props.person.age;
});

const initData = async (): Promise<void> => {
  try {
    const dbPersons = await dbService.getAllPersons();
    persons.value = [defaultPerson, ...dbPersons.filter(person => person.id !== defaultPerson.id)];
  } catch (error) {
    console.error('Failed to load persons:', error);
  }
};

const goToPersonManagement = (): void => {
  uni.navigateTo({
    url: '/pages/persons/persons'
  });
};

const openPersonSelectModal = (): void => {
  personSelectPopup.value?.open();
};

const closePersonSelectModal = (): void => {
  personSelectPopup.value?.close();
};

const selectPerson = (p: Person): void => {
  const { id, ...personData } = p;
  emit('update', personData);
  closePersonSelectModal();
};

const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=random&color=fff&size=64`;
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.person-input-component {
  margin-bottom: 12px;
}

.person-select-container {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 12px;
  text-align: center;
}

.person-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.select-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
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

.person-info-container {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.person-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(0, 122, 255, 0.05);
  border-bottom: 1px solid #e0e0e0;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-button:active {
  background-color: rgba(0, 122, 255, 0.1);
}

.person-content {
  padding: 12px 16px;
}

.info-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.info-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 3px;
}

.info-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

.person-select-modal {
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  max-height: 60vh;
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
  color: #007AFF;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.text-button {
  padding: 8px 16px;
  font-size: 14px;
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.text-button.primary {
  background: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

.person-list {
  max-height: 50vh;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #007AFF;
  margin: 16px;
  text-align: center;
}

.person-list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.person-list-item:active {
  background-color: rgba(0, 122, 255, 0.05);
}

.person-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.person-info {
  flex: 1;
}

.person-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.person-details {
  font-size: 14px;
  color: #999;
  margin-bottom: 2px;
}

.person-location {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
