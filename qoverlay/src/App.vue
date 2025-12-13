<template>
  <ion-app>
    <!-- 加载状态 -->
    <ion-loading
      :is-open="isLoading"
      :message="t('初始化.加载中')"
      :spinner="spinnerType"
    ></ion-loading>

    <!-- 初始化模态框 -->
    <InitModalComponent
      :is-open="showInitModal"
      @close="handleInitModalClose"
      @confirm="handleInitModalConfirm"
    />

    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="main-menu">
            <ion-list-header>{{ $t("导航菜单.标题") }}</ion-list-header>
            <ion-note>{{ $t("导航菜单.副标题") }}</ion-note>

            <ion-menu-toggle
              :auto-hide="false"
              v-for="(p, i) in appPages"
              :key="i"
            >
              <ion-item
                router-direction="root"
                :router-link="p.url"
                lines="none"
                :detail="false"
                class="hydrated"
                :class="{ selected: selectedIndex === i }"
              >
                <ion-icon
                  aria-hidden="true"
                  slot="start"
                  :ios="p.iosIcon"
                  :md="p.mdIcon"
                ></ion-icon>
                <ion-label>{{ $t(`导航菜单.页面.${p.key}`) }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <!-- 语言切换 -->
          <ion-list class="language-list">
            <ion-list-header>
              <ion-icon
                slot="start"
                :ios="languageOutline"
                :md="languageSharp"
              ></ion-icon>
              {{ $t("导航菜单.语言") }}
            </ion-list-header>
            <ion-item>
              <ion-select
                :model-value="i18n.global.locale.value"
                @ionChange="handleLanguageChange"
                placeholder="选择语言"
                interface="popover"
              >
                <ion-select-option
                  v-for="lang in languages"
                  :key="lang.value"
                  :value="lang.value"
                >
                  {{ lang.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonSpinner,
} from "@ionic/vue";
import { ref, onMounted, provide, watch } from "vue";
import i18n, { loadLanguageFile } from "./i18n";
import { provideDbService, injectDbService } from "./services/dbService";
import { createInitService } from "./services/initService";
import InitModalComponent from "./components/InitModalComponent.vue";
import {
  calculatorOutline,
  calculatorSharp,
  informationCircleOutline,
  informationCircleSharp,
  shieldCheckmarkOutline,
  shieldCheckmarkSharp,
  documentTextOutline,
  documentTextSharp,
  chatbubbleOutline,
  chatbubbleSharp,
  heartOutline,
  heartSharp,
  bookOutline,
  bookSharp,
  helpCircleOutline,
  helpCircleSharp,
  languageOutline,
  languageSharp,
  personOutline,
  personSharp,
} from "ionicons/icons";
import router from "./router";

// 提供数据库服务
const dbService = provideDbService();

// 初始化服务
const initService = createInitService(dbService);
const t = i18n.global.t;
// 初始化状态
const isLoading = ref(true);
const showInitModal = ref(false);
const spinnerType = ref("dots");

const selectedIndex = ref(0);
const appPages = [
  {
    key: "计算器",
    url: "/main",
    iosIcon: calculatorOutline,
    mdIcon: calculatorSharp,
  },
  {
    key: "人员管理",
    url: "/persons",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    key: "关于我们",
    url: "/about",
    iosIcon: informationCircleOutline,
    mdIcon: informationCircleSharp,
  },
  {
    key: "隐私政策",
    url: "/privacy-policy",
    iosIcon: shieldCheckmarkOutline,
    mdIcon: shieldCheckmarkSharp,
  },
  {
    key: "条款与条件",
    url: "/terms",
    iosIcon: documentTextOutline,
    mdIcon: documentTextSharp,
  },
  {
    key: "参考文献",
    url: "/references",
    iosIcon: bookOutline,
    mdIcon: bookSharp,
  },
  {
    key: "名词解释",
    url: "/glossary",
    iosIcon: helpCircleOutline,
    mdIcon: helpCircleSharp,
  },
  {
    key: "反馈",
    url: "/feedback",
    iosIcon: chatbubbleOutline,
    mdIcon: chatbubbleSharp,
  },
  {
    key: "赞助",
    url: "/sponsor",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
];

const path = window.location.pathname;
if (path !== undefined) {
  selectedIndex.value = appPages.findIndex((page) => page.url === path) || 0;
}

// 语言切换
const languages = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

// 切换语言处理函数
const handleLanguageChange = (event: any) => {
  const lang = event.detail.value;
  loadLanguageFile(lang);
};

// 初始化工作流
const initApp = async () => {
  try {
    // 显示加载状态
    isLoading.value = true;

    // 检查是否为首次使用
    const isFirstUse = await initService.checkFirstUse();

    // 初始化数据库
    await initService.initDatabase();

    // 隐藏加载状态
    isLoading.value = false;

    // 如果是首次使用，显示初始化模态框
    if (isFirstUse) {
      showInitModal.value = true;
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    isLoading.value = false;
  }
};

// 处理初始化模态框关闭
const handleInitModalClose = () => {
  // 首次使用必须完成初始化，所以不能关闭模态框
  // 这里可以添加一些逻辑，比如退出应用或重新显示模态框
  console.log("Init modal closed");
};

// 处理初始化模态框确认
const handleInitModalConfirm = async (userData: any) => {
  try {
    // 保存初始用户信息
    await initService.saveInitialUser(userData);
    // 设置首次使用时间
    initService.setFirstUseTime();
    // 隐藏初始化模态框
    showInitModal.value = false;
  } catch (error) {
    console.error("Error saving initial user:", error);
    // 可以显示错误信息
  }
};

// 组件挂载时执行初始化
onMounted(async () => {
  await initApp();
});

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    selectedIndex.value =
      appPages.findIndex((page) => page.url.startsWith(newPath)) || 0;
  }
);
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#main-menu {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#main-menu ion-list-header {
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;
  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
