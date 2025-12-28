<template>
  <view class="terms-page">
    <scroll-view scroll-y class="content-container">
      <view class="card">
        <view class="card-content">
          <view class="page-title">{{ t('条款页面.标题') }}</view>
          <view class="update-date">{{ t('条款页面.更新日期') }}：2025年12月13日</view>

          <view class="section">
            <view class="section-title">{{ t('条款.引言.标题') }}</view>
            <view class="paragraph">{{ t('条款.引言.第一段') }}</view>
            <view class="paragraph">{{ t('条款.引言.第二段') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.服务条款.标题') }}</view>
            <view class="paragraph">{{ t('条款.服务条款.计算模式') }}</view>
            <view class="list">
              <view class="list-item"><text class="strong">{{ t('条款.服务条款.速算版本') }}</text>：{{ t('条款.服务条款.速算版本描述') }}</view>
              <view class="list-item"><text class="strong">{{ t('条款.服务条款.精算版本') }}</text>：{{ t('条款.服务条款.精算版本描述') }}</view>
            </view>
            <view class="paragraph">{{ t('条款.服务条款.变更权利') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.用户权利义务.标题') }}</view>
            <view class="paragraph"><text class="strong">{{ t('条款.用户权利义务.您的权利') }}：</text></view>
            <view class="list">
              <view class="list-item">• {{ t('条款.用户权利义务.权利.使用服务') }}</view>
              <view class="list-item">• {{ t('条款.用户权利义务.权利.获得结果') }}</view>
              <view class="list-item">• {{ t('条款.用户权利义务.权利.分享结果') }}</view>
            </view>
            <view class="paragraph"><text class="strong">{{ t('条款.用户权利义务.您的义务') }}：</text></view>
            <view class="list">
              <view class="list-item">• {{ t('条款.用户权利义务.义务.提供准确信息') }}</view>
              <view class="list-item">• {{ t('条款.用户权利义务.义务.遵守法律') }}</view>
              <view class="list-item">• {{ t('条款.用户权利义务.义务.不滥用服务') }}</view>
              <view class="list-item">• {{ t('条款.用户权利义务.义务.不侵犯知识产权') }}</view>
            </view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.服务变更终止.标题') }}</view>
            <view class="paragraph">{{ t('条款.服务变更终止.第一段') }}</view>
            <view class="paragraph">{{ t('条款.服务变更终止.第二段') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.知识产权.标题') }}</view>
            <view class="paragraph">{{ t('条款.知识产权.第一段') }}</view>
            <view class="paragraph">{{ t('条款.知识产权.第二段') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.免责声明.标题') }}</view>
            <view class="paragraph">{{ t('条款.免责声明.第一段') }}</view>
            <view class="paragraph">{{ t('条款.免责声明.第二段') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.责任限制.标题') }}</view>
            <view class="paragraph">{{ t('条款.责任限制.内容') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.法律适用争议解决.标题') }}</view>
            <view class="paragraph">{{ t('条款.法律适用争议解决.法律管辖') }}</view>
            <view class="paragraph">{{ t('条款.法律适用争议解决.争议解决') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.条款变更.标题') }}</view>
            <view class="paragraph">{{ t('条款.条款变更.第一段') }}</view>
            <view class="paragraph">{{ t('条款.条款变更.第二段') }}</view>
          </view>

          <view class="section">
            <view class="section-title">{{ t('条款.联系我们.标题') }}</view>
            <view class="paragraph">{{ t('条款.联系我们.内容') }}</view>
            <view class="paragraph">{{ t('条款.联系我们.邮箱') }}：terms@quantum-overlay.example</view>
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
.terms-page {
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

.strong {
  font-weight: bold;
  color: #007AFF;
}
</style>
