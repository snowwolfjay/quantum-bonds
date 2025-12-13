<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>隐私政策</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">隐私政策</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>隐私政策</h2>
                <p>更新日期：2025年12月13日</p>
                
                <h3>1. 引言</h3>
                <p>欢迎使用量子重叠计算工具。本隐私政策解释了我们如何收集、使用、存储和保护您的个人信息。</p>
                
                <h3>2. 我们收集的信息</h3>
                <p>当您使用我们的应用时，我们可能会收集以下信息：</p>
                <ul>
                  <li>您提供的个人数据，如姓名、邮箱地址（仅在您自愿提供时）</li>
                  <li>您输入的计算参数，如位置坐标、体重、身高、出生日期等</li>
                  <li>设备信息，如设备型号、操作系统版本等</li>
                  <li>使用数据，如应用使用频率、访问的页面等</li>
                </ul>
                
                <h3>3. 我们如何使用您的信息</h3>
                <p>我们收集的信息主要用于：</p>
                <ul>
                  <li>提供、维护和改进我们的服务</li>
                  <li>处理您的请求和反馈</li>
                  <li>生成计算结果</li>
                  <li>分析应用使用情况，以优化用户体验</li>
                </ul>
                
                <h3>4. 信息共享与披露</h3>
                <p>我们不会将您的个人信息出售或出租给第三方。我们可能会在以下情况下共享您的信息：</p>
                <ul>
                  <li>获得您的明确同意</li>
                  <li>遵守法律法规要求</li>
                  <li>保护我们的权利、财产或安全</li>
                  <li>与我们的服务提供商共享，以协助我们提供服务</li>
                </ul>
                
                <h3>5. 数据安全</h3>
                <p>我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、使用或披露。但请注意，没有任何安全措施是绝对安全的，我们不能保证您的信息绝对安全。</p>
                
                <h3>6. 数据保留</h3>
                <p>我们会在必要的时间内保留您的个人信息，以提供我们的服务并遵守法律法规要求。当信息不再需要时，我们会安全地删除或匿名化处理。</p>
                
                <h3>7. 您的权利</h3>
                <p>根据适用法律，您可能有权：</p>
                <ul>
                  <li>访问、更正或删除您的个人信息</li>
                  <li>限制或反对我们使用您的个人信息</li>
                  <li>数据可携带权</li>
                  <li>撤回同意</li>
                </ul>
                
                <h3>8. 隐私政策的变更</h3>
                <p>我们可能会不时更新本隐私政策。当我们做出重大变更时，我们会通过应用内通知或其他方式通知您。</p>
                
                <h3>9. 联系我们</h3>
                <p>如果您对本隐私政策有任何疑问或 concerns，请通过以下方式联系我们：</p>
                <p>邮箱：privacy@quantum-overlay.example</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent
} from '@ionic/vue';
</script>

<style scoped>
ion-card {
  margin-top: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--ion-color-primary);
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 15px;
  color: var(--ion-color-primary-shade);
}

p {
  margin-bottom: 15px;
  line-height: 1.6;
}

ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}
</style>