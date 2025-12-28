<template>
  <view class="feedback-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-header">
          <view class="card-title">{{ t('反馈页面.发送反馈') }}</view>
          <view class="card-subtitle">{{ t('反馈页面.请告诉我们') }}</view>
        </view>
        <view class="card-content">
          <view class="form-group">
            <view class="input-label">{{ t('反馈页面.姓名') }}</view>
            <input
              v-model="feedback.name"
              class="custom-input"
              :placeholder="t('反馈页面.姓名')"
            />
          </view>

          <view class="form-group">
            <view class="input-label">{{ t('反馈页面.邮箱') }}</view>
            <input
              v-model="feedback.email"
              type="email"
              class="custom-input"
              :placeholder="t('反馈页面.邮箱')"
            />
          </view>

          <view class="form-group">
            <view class="input-label">{{ t('反馈页面.反馈类型') }}</view>
            <picker mode="selector" :range="feedbackTypes" :value="feedback.typeIndex" @change="onFeedbackTypeChange">
              <view class="picker-value">{{ feedbackTypes[feedback.typeIndex].label }}</view>
            </picker>
          </view>

          <view class="form-group">
            <view class="input-label">{{ t('反馈页面.反馈内容') }}</view>
            <textarea
              v-model="feedback.content"
              class="custom-textarea"
              :rows="6"
              :placeholder="请输入您的反馈内容..."
            />
          </view>

          <button class="submit-button" @click="submitFeedback" :disabled="isSubmitting">
            <text v-if="isSubmitting" class="loading-icon">⏳</text>
            {{ isSubmitting ? t('反馈页面.提交中') : t('反馈页面.提交反馈') }}
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Feedback {
  name: string;
  email: string;
  type: string;
  content: string;
}

interface FeedbackType {
  value: string;
  label: string;
}

const { t } = useI18n();

const feedback = ref<Feedback>({
  name: '',
  email: '',
  type: '',
  content: ''
});

const feedbackTypes: FeedbackType[] = [
  { value: 'suggestion', label: '建议' },
  { value: 'bug', label: 'bug 报告' },
  { value: 'question', label: '问题' },
  { value: 'other', label: '其他' }
];

const feedbackTypeIndex = ref(0);
const isSubmitting = ref(false);

const onFeedbackTypeChange = (e: any): void => {
  feedbackTypeIndex.value = e.detail.value;
  feedback.value.type = feedbackTypes[e.detail.value].value;
};

const submitFeedback = (): void => {
  isSubmitting.value = true;

  setTimeout(() => {
    feedback.value = {
      name: '',
      email: '',
      type: '',
      content: ''
    };

    uni.showToast({
      title: t('反馈页面.提交成功'),
      icon: 'success',
      duration: 2000
    });

    isSubmitting.value = false;
  }, 1500);
};
</script>

<style scoped>
.feedback-page {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.content-container {
  height: 100vh;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #007AFF;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 14px;
  color: #999;
}

.card-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
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

.custom-textarea {
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
  min-height: 120px;
}

.custom-textarea:focus {
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.picker-value {
  padding: 12px 16px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:disabled {
  opacity: 0.5;
}

.loading-icon {
  font-size: 20px;
}
</style>
