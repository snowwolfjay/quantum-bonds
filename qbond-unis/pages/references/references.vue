<template>
  <view class="references-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-content">
          <view class="page-title">{{ t('参考文献页面.标题') }}</view>

          <view
            class="reference-item"
            v-for="(reference, index) in references"
            :key="index"
          >
            <view class="reference-title">{{ reference.title }}</view>
            <view class="reference-meta">{{ reference.author }} - {{ reference.year }}</view>
            <view class="reference-content">{{ reference.content }}</view>
            <view class="reference-link">
              <text class="link-text">{{ reference.link }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Reference {
  title: string;
  author: string;
  year: string;
  content: string;
  link: string;
}

const { t } = useI18n();

const references = ref<Reference[]>([
  {
    title: "量子力学基础",
    author: "张三",
    year: "2023",
    content: "本书介绍了量子力学的基本概念和原理，包括波粒二象性、不确定性原理等。",
    link: "https://example.com/reference1"
  },
  {
    title: "人体量子交换机制",
    author: "李四",
    year: "2024",
    content: "研究了人体之间量子交换的可能机制和影响因素。",
    link: "https://example.com/reference2"
  },
  {
    title: "量子重叠计算模型",
    author: "王五",
    year: "2025",
    content: "提出了一种计算人与人之间量子重叠的数学模型。",
    link: "https://example.com/reference3"
  }
]);
</script>

<style scoped>
.references-page {
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

.card-content {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #007AFF;
}

.reference-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.reference-item:last-child {
  border-bottom: none;
}

.reference-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.reference-meta {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}

.reference-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 10px;
}

.reference-link {
  margin-top: 10px;
}

.link-text {
  font-size: 14px;
  color: #007AFF;
  text-decoration: none;
  word-break: break-all;
}
</style>
