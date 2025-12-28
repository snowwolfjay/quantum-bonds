<template>
  <view class="privacy-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-content">
          <view class="page-title">{{ t('隐私政策页面.标题') }}</view>
          <view class="update-date">{{ t('隐私政策页面.更新日期') }}：2025年12月13日</view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.引言.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.引言.内容') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.收集信息.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.收集信息.内容') }}</view>
            <view class="list">
              <view class="list-item">• {{ t('隐私政策.收集信息.项目.个人数据') }}</view>
              <view class="list-item">• {{ t('隐私政策.收集信息.项目.计算参数') }}</view>
              <view class="list-item">• {{ t('隐私政策.收集信息.项目.设备信息') }}</view>
              <view class="list-item">• {{ t('隐私政策.收集信息.项目.使用数据') }}</view>
            </view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.使用信息.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.使用信息.内容') }}</view>
            <view class="list">
              <view class="list-item">• {{ t('隐私政策.使用信息.项目.提供服务') }}</view>
              <view class="list-item">• {{ t('隐私政策.使用信息.项目.处理请求') }}</view>
              <view class="list-item">• {{ t('隐私政策.使用信息.项目.生成结果') }}</view>
              <view class="list-item">• {{ t('隐私政策.使用信息.项目.优化体验') }}</view>
            </view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.信息共享.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.信息共享.内容') }}</view>
            <view class="list">
              <view class="list-item">• {{ t('隐私政策.信息共享.项目.明确同意') }}</view>
              <view class="list-item">• {{ t('隐私政策.信息共享.项目.法律法规') }}</view>
              <view class="list-item">• {{ t('隐私政策.信息共享.项目.保护权益') }}</view>
              <view class="list-item">• {{ t('隐私政策.信息共享.项目.服务提供商') }}</view>
            </view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.数据安全.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.数据安全.内容') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.数据保留.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.数据保留.内容') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.用户权利.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.用户权利.内容') }}</view>
            <view class="list">
              <view class="list-item">• {{ t('隐私政策.用户权利.项目.访问更正删除') }}</view>
              <view class="list-item">• {{ t('隐私政策.用户权利.项目.限制反对') }}</view>
              <view class="list-item">• {{ t('隐私政策.用户权利.项目.数据可携带') }}</view>
              <view class="list-item">• {{ t('隐私政策.用户权利.项目.撤回同意') }}</view>
            </view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.政策变更.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.政策变更.内容') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('隐私政策.联系我们.标题') }}</view>
            <view class="paragraph">{{ t('隐私政策.联系我们.内容') }}</view>
            <view class="paragraph">{{ t('隐私政策.联系我们.邮箱') }}：privacy@quantum-overlay.example</view>
          </view>
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
.privacy-page {
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

.update-date {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #007AFF;
}

.paragraph {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

.list {
  margin-left: 20px;
}

.list-item {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 8px;
}
</style>
