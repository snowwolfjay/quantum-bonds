<template>
  <view class="main-calc-page">
    

    <PreciseCalcComponent  />

  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'; 
import PreciseCalcComponent from '../../components/PreciseCalcComponent.vue';

</script>

<style scoped>
.main-calc-page {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.segment-container {
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.segment-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.segment-item.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
  font-weight: 600;
}

.segment-item:active {
  background-color: rgba(0, 122, 255, 0.05);
}
</style>
