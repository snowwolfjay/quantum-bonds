<template>
  <view class="glossary-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-content">
          <view class="page-title">{{ t('名词解释页面.标题') }}</view>

          <view
            class="term-item"
            v-for="(term, index) in glossaryTerms"
            :key="index"
          >
            <view class="term-title">{{ t(`名词解释.${term.key}.术语`) }}</view>
            <view class="term-description">{{ t(`名词解释.${term.key}.描述`) }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Term {
  key: string;
}

const { t } = useI18n();

const glossaryTerms = ref<Term[]>([
  {
    key: "量子重叠"
  },
  {
    key: "量子交换"
  },
  {
    key: "直接量子交换量"
  },
  {
    key: "间接量子交换量"
  },
  {
    key: "跃迁量子交换量"
  },
  {
    key: "量子扩散抵达率"
  }
]);
</script>

<style scoped>
.glossary-page {
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

.term-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.term-item:last-child {
  border-bottom: none;
}

.term-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #007AFF;
}

.term-description {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}
</style>
