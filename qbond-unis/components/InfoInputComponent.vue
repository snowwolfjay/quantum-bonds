<template>
  <view class="info-input-component">
    <view class="input-group">
      <view class="input-label">{{ t('计算页面.人员.称呼') }}</view>
      <input
        v-model="localModel.name"
        :placeholder="t('初始化.姓名占位符')"
        class="custom-input"
        :class="{ 'input-error': touched && errors.name }"
        @input="onInput"
      />
      <view v-if="touched && errors.name" class="error-text">{{ errors.name }}</view>
    </view>

    <view class="input-group">
      <view class="input-label">{{ t('计算页面.人员.身高') + ' (cm)' }}</view>
      <input
        v-model.number="localModel.height"
        type="digit"
        :placeholder="t('初始化.身高占位符')"
        class="custom-input"
        :class="{ 'input-error': touched && errors.height }"
        @input="onInput"
      />
      <view v-if="touched && errors.height" class="error-text">{{ errors.height }}</view>
    </view>

    <view class="input-group">
      <view class="input-label">{{ t('计算页面.人员.体重') + ' (kg)' }}</view>
      <input
        v-model.number="localModel.weight"
        type="digit"
        :placeholder="t('初始化.体重占位符')"
        class="custom-input"
        :class="{ 'input-error': touched && errors.weight }"
        @input="onInput"
      />
      <view v-if="touched && errors.weight" class="error-text">{{ errors.weight }}</view>
    </view>

    <view class="input-group">
      <view class="input-label">{{ t('计算页面.人员.年龄') + ' (' + t('计算页面.人员.岁') + ')' }}</view>
      <input
        v-model.number="localModel.age"
        type="number"
        :placeholder="t('初始化.年龄占位符')"
        class="custom-input"
        :class="{ 'input-error': touched && errors.age }"
        @input="onInput"
      />
      <view v-if="touched && errors.age" class="error-text">{{ errors.age }}</view>
    </view>

    <view class="input-group">
      <view class="input-label">{{ t('编辑模态框.位置') }}</view>
      <input
        v-model="localModel.location"
        :placeholder="t('编辑模态框.位置占位符')"
        class="custom-input"
        :class="{ 'input-error': touched && errors.location }"
        @input="onInput"
      />
      <view v-if="touched && errors.location" class="error-text">{{ errors.location }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface PersonModel {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

interface Errors {
  name: string;
  location: string;
  height: string;
  weight: string;
  age: string;
}

const props = defineProps<{
  modelValue: PersonModel;
  touched: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: PersonModel): void;
  (e: 'reset-touched'): void;
}>();

const { t } = useI18n();

const localModel = ref<PersonModel>({
  name: '',
  location: '',
  weight: null,
  height: null,
  age: null
});

const errors = ref<Errors>({
  name: '',
  location: '',
  height: '',
  weight: '',
  age: ''
});

const validateForm = (data: PersonModel): boolean => {
  let isValid = true;

  if (!data.name.trim()) {
    errors.value.name = t("初始化.姓名必填");
    isValid = false;
  } else {
    errors.value.name = '';
  }

  if (data.height === null || isNaN(data.height) || data.height <= 0) {
    errors.value.height = t("初始化.身高必填");
    isValid = false;
  } else {
    errors.value.height = '';
  }

  if (data.weight === null || isNaN(data.weight) || data.weight <= 0) {
    errors.value.weight = t("初始化.体重必填");
    isValid = false;
  } else {
    errors.value.weight = '';
  }

  if (data.age === null || isNaN(data.age) || data.age <= 0) {
    errors.value.age = t("初始化.年龄必填");
    isValid = false;
  } else {
    errors.value.age = '';
  }

  if (data.location.trim()) {
    const coords = data.location.trim().split(',').map(coord => parseFloat(coord.trim()));
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1]) ||
        coords[0] < -90 || coords[0] > 90 ||
        coords[1] < -180 || coords[1] > 180) {
      errors.value.location = t("初始化.位置格式错误");
      isValid = false;
    } else {
      errors.value.location = '';
    }
  } else {
    isValid = false;
    errors.value.location = t("初始化.位置格式错误");
  }

  return isValid;
};

watch(() => props.modelValue, (newValue) => {
  localModel.value = { ...newValue };
  validateForm(newValue);
}, { immediate: true, deep: true });

const onInput = (): void => {
  emit('update:modelValue', { ...localModel.value });
  emit('reset-touched');
};

defineExpose({
  validateForm
});
</script>

<style scoped>
.info-input-component {
  padding: 16px;
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
  color: #333;
  margin-bottom: 4px;
}

.custom-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.custom-input:focus {
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.custom-input.input-error {
  border-color: #ff4757;
}

.error-text {
  font-size: 12px;
  color: #ff4757;
  margin-top: 4px;
}
</style>
