<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>条款与条件</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">条款与条件</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="8" offset-md="2">
            <ion-card>
              <ion-card-content>
                <h2>条款与条件</h2>
                <p>更新日期：2025年12月13日</p>
                
                <h3>1. 引言</h3>
                <p>欢迎使用量子重叠计算工具。本条款与条件（"条款"）规定了您使用我们的应用和服务（"服务"）的权利和义务。</p>
                <p>通过访问或使用我们的服务，您同意受本条款的约束。如果您不同意本条款的任何部分，请勿使用我们的服务。</p>
                
                <h3>2. 服务条款</h3>
                <p>我们提供两种计算模式：</p>
                <ul>
                  <li><strong>速算版本</strong>：免费提供，提供基本的量子重叠计算功能</li>
                  <li><strong>精算版本</strong>：需要订阅，提供更详细的计算结果和分析</li>
                </ul>
                <p>我们保留随时修改、暂停或终止服务的权利，无需事先通知。</p>
                
                <h3>3. 用户权利和义务</h3>
                <p><strong>您的权利：</strong></p>
                <ul>
                  <li>使用我们提供的服务</li>
                  <li>获得计算结果</li>
                  <li>分享计算结果（遵循相关法律法规）</li>
                </ul>
                <p><strong>您的义务：</strong></p>
                <ul>
                  <li>提供准确、完整的信息</li>
                  <li>遵守适用的法律法规</li>
                  <li>不滥用我们的服务</li>
                  <li>不侵犯他人的知识产权</li>
                </ul>
                
                <h3>4. 服务变更和终止</h3>
                <p>我们可能会不时更新或修改我们的服务。我们保留随时终止或暂停服务的权利，无需事先通知。</p>
                <p>您可以随时停止使用我们的服务。</p>
                
                <h3>5. 知识产权</h3>
                <p>我们的服务和相关内容（包括但不限于代码、设计、图像、文本等）受知识产权法律保护。</p>
                <p>您不得复制、修改、分发、出售或出租我们的服务或其任何部分，除非获得我们的明确书面许可。</p>
                
                <h3>6. 免责声明</h3>
                <p>我们的服务仅供参考和教育目的。计算结果基于简化的模型和假设，不应被视为科学事实或医学建议。</p>
                <p>我们不保证服务的准确性、完整性或可靠性。使用我们的服务所产生的任何后果由您自行承担。</p>
                
                <h3>7. 责任限制</h3>
                <p>在法律允许的最大范围内，我们不对因使用或无法使用我们的服务而产生的任何直接、间接、偶然、特殊或后果性损害负责。</p>
                
                <h3>8. 法律适用和争议解决</h3>
                <p>本条款受中华人民共和国法律管辖。</p>
                <p>任何因本条款或服务而产生的争议应通过友好协商解决；协商不成的，应提交至有管辖权的人民法院。</p>
                
                <h3>9. 条款变更</h3>
                <p>我们可能会不时更新本条款。当我们做出重大变更时，我们会通过应用内通知或其他方式通知您。</p>
                <p>您继续使用我们的服务即表示您接受更新后的条款。</p>
                
                <h3>10. 联系我们</h3>
                <p>如果您对本条款有任何疑问，请通过以下方式联系我们：</p>
                <p>邮箱：terms@quantum-overlay.example</p>
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

strong {
  font-weight: bold;
  color: var(--ion-color-primary-shade);
}
</style>