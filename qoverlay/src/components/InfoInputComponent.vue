<template>
  <ion-list>
    <!-- 姓名输入 -->
    <ion-item>
      <ion-input v-model="localModel.name" :label="t('计算页面.人员.称呼')" :placeholder="t('初始化.姓名占位符')"
        :error-text="errors.name" :class="{
          'ion-invalid': touched && !!errors.name,
          'ion-touched': touched,
        }" @input="onInput"></ion-input>
    </ion-item>

    <!-- 身高输入 -->
    <ion-item>
      <ion-input v-model.number="localModel.height" :label="t('计算页面.人员.身高') + ' (cm)'" type="number"
        :placeholder="t('初始化.身高占位符')" :error-text="errors.height" :class="{
          'ion-invalid': touched && !!errors.height,
          'ion-touched': touched,
        }" @input="onInput"></ion-input>
    </ion-item>

    <!-- 体重输入 -->
    <ion-item>
      <ion-input v-model.number="localModel.weight" :label="t('计算页面.人员.体重') + ' (kg)'" type="number"
        :placeholder="t('初始化.体重占位符')" :error-text="errors.weight" :class="{
          'ion-invalid': touched && !!errors.weight,
          'ion-touched': touched,
        }" @input="onInput"></ion-input>
    </ion-item>

    <!-- 年龄输入 -->
    <ion-item>
      <ion-input v-model.number="localModel.age" :label="t('计算页面.人员.年龄') + ' (' + t('计算页面.人员.岁') + ')'" type="number"
        :placeholder="t('初始化.年龄占位符')" :error-text="errors.age" :class="{
          'ion-invalid': touched && !!errors.age,
          'ion-touched': touched,
        }" @input="onInput"></ion-input>
    </ion-item>
    <!-- 位置输入 -->
    <ion-item>
      <ion-input v-model="localModel.location" :label="t('编辑模态框.位置')" :placeholder="t('编辑模态框.位置占位符')"
        :error-text="errors.location" :class="{
          'ion-invalid': touched && !!errors.location,
          'ion-touched': touched,
        }" @input="onInput"></ion-input>
      <ion-button slot="end" fill="clear" @click="$emit('reset-touched')" @click.stop="locatePosition">
        <ion-icon slot="icon-only" :icon="locationOutline"></ion-icon>

      </ion-button>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { IonList, IonItem, IonInput, IonButton, IonIcon } from "@ionic/vue";
import { useI18n } from "vue-i18n";
import { Person } from "../services/dbService";
import { locationOutline } from "ionicons/icons";

// 国际化
const { t } = useI18n();

// Props
const props = defineProps<{
  modelValue: Omit<Person, "id">;
  touched: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: Omit<Person, "id">): void;
  (e: "reset-touched"): void;
}>();
const locatePosition = () => {
  import("../platform/geolocation/export").then(m => {
    m.getCurrentPosition().then(position => {
      const { latitude, longitude } = position.coords;
      localModel.value.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      onInput(); // 触发输入事件，更新父组件数据
    }).catch(error => {
      console.error("获取位置失败:", error);
    });
  })
};
// 本地模型，用于v-model双向绑定
const localModel = ref<Omit<Person, "id">>({
  name: "",
  location: "",
  weight: null,
  height: null,
  age: null,
});

// 错误信息对象
const errors = ref({
  name: "",
  location: "",
  height: "",
  weight: "",
  age: "",
});

// 验证表单
const validateForm = (data: Omit<Person, "id">): boolean => {
  let isValid = true;

  // 验证姓名
  if (!data.name.trim()) {
    errors.value.name = t("初始化.姓名必填");
    isValid = false;
  } else {
    errors.value.name = "";
  }

  // 验证身高
  if (data.height === null || isNaN(data.height) || data.height <= 0) {
    errors.value.height = t("初始化.身高必填");
    isValid = false;
  } else {
    errors.value.height = "";
  }

  // 验证体重
  if (data.weight === null || isNaN(data.weight) || data.weight <= 0) {
    errors.value.weight = t("初始化.体重必填");
    isValid = false;
  } else {
    errors.value.weight = "";
  }

  // 验证年龄
  if (data.age === null || isNaN(data.age) || data.age <= 0) {
    errors.value.age = t("初始化.年龄必填");
    isValid = false;
  } else {
    errors.value.age = "";
  }

  // 验证经纬度
  if (data.location.trim()) {
    const coords = data.location
      .trim()
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (
      coords.length !== 2 ||
      isNaN(coords[0]) ||
      isNaN(coords[1]) ||
      coords[0] < -90 ||
      coords[0] > 90 ||
      coords[1] < -180 ||
      coords[1] > 180
    ) {
      errors.value.location = t("初始化.位置格式错误");
      isValid = false;
    } else {
      errors.value.location = "";
    }
  } else {
    isValid = false;
    errors.value.location = t("初始化.位置格式错误");
  }
  return isValid;
};

// 监听modelValue变化，更新localModel
watch(
  () => props.modelValue,
  (newValue) => {
    localModel.value = { ...newValue };
    validateForm(newValue);
  },
  { immediate: true, deep: true }
);

defineExpose({
  validateForm,
});

// 输入事件处理
const onInput = () => {
  emit("update:modelValue", { ...localModel.value });
  emit("reset-touched");
};

</script>
