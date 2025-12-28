<template>
  <view class="about-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-header">
          <view class="card-title">{{ t('关于页面.项目介绍.标题') }}</view>
        </view>
        <view class="card-content">
          <view class="paragraph">{{ t('关于页面.项目介绍.第一段') }}</view>
          <view class="paragraph">{{ t('关于页面.项目介绍.第二段') }}</view>
          <view class="paragraph">{{ t('关于页面.项目介绍.第三段') }}</view>
          <view class="paragraph">{{ t('关于页面.项目介绍.第四段') }}</view>
        </view>
      </view>

      <view class="card">
        <view class="card-header">
          <view class="card-title">{{ t('关于页面.联系作者.标题') }}</view>
        </view>
        <view class="card-content">
          <view class="contact-item">
            <text class="contact-icon">📧</text>
            <view class="contact-info">
              <view class="contact-label">{{ t('关于页面.联系作者.邮箱') }}</view>
              <view class="contact-value">contact@quantum-overlay.example</view>
            </view>
          </view>
          <view class="contact-item">
            <text class="contact-icon">📦</text>
            <view class="contact-info">
              <view class="contact-label">GitHub</view>
              <view class="contact-value">github.com/quantum-overlay</view>
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <view class="card-header">
          <view class="card-title">{{ t('关于页面.开源协议.标题') }}</view>
        </view>
        <view class="card-content">
          <view class="paragraph">{{ t('关于页面.开源协议.第一段') }}</view>
          <view class="paragraph">{{ t('关于页面.开源协议.第二段') }}</view>
          <view class="paragraph">{{ t('关于页面.开源协议.第三段') }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.about-page {
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
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #007AFF;
}

.card-content {
  padding: 16px;
}

.paragraph {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
}

.contact-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
}

.contact-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 16px;
  color: #333;
}
</style>
