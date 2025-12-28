# Ionic+Vue3 到 UniApp+Vue3 迁移任务清单

## 项目概述
将 `d:\projects\quantum-owner\qoverlay` 中基于Ionic+Vue3开发的简单计算软件迁移至 `d:\projects\quantum-owner\qbond-unis` 中的UniApp+Vue3项目。

## 任务列表

### 阶段1: 项目分析
- [ ] 分析原项目结构和依赖
- [ ] 识别需要迁移的页面、组件和服务
- [ ] 确定Ionic组件到UniApp组件的映射关系

### 阶段2: 项目结构准备
- [ ] 创建UniApp项目目录结构
- [ ] 配置pages.json路由文件

### 阶段3: 核心功能迁移
- [ ] 迁移国际化配置(i18n)
- [ ] 迁移数据存储服务(rxdb -> uni.storage)
- [ ] 迁移工具函数(preciseCalc, quickCalc, shareUtils)

### 阶段4: 组件迁移
- [ ] 迁移InfoInputComponent
- [ ] 迁移InitModalComponent
- [ ] 迁移PersonInputComponent
- [ ] 迁移PreciseCalcComponent
- [ ] 迁移QuickCalcComponent

### 阶段5: 页面迁移
- [ ] 迁移MainCalcPage
- [ ] 迁移PersonManagementPage
- [ ] 迁移AboutPage
- [ ] 迁移PrivacyPolicyPage
- [ ] 迁移TermsPage
- [ ] 迁移FeedbackPage
- [ ] 迁移SponsorPage
- [ ] 迁移ReferencesPage
- [ ] 迁移GlossaryPage

### 阶段6: 应用配置
- [ ] 更新App.vue
- [ ] 更新main.js
- [ ] 配置全局样式

### 阶段7: 测试与验证
- [ ] 进行功能测试和验证
- [ ] 验证计算功能的准确性
- [ ] 验证数据存储的可靠性
- [ ] 边界条件测试
- [ ] 异常处理测试

### 阶段8: 文档
- [ ] 创建迁移审查文档

## 迁移要求

1. **功能一致性**: 完整迁移原软件的所有页面、组件及业务逻辑
2. **框架替换**: 将Ionic框架相关API和组件替换为UniApp对应的API和组件
3. **存储方案**: 将rxdb替换为uni.storage API
4. **Vue3规范**: 保持Vue3的语法和组件结构，符合Composition API规范
5. **UniApp规范**: 确保代码符合UniApp开发规范，支持H5、小程序及App等平台
6. **测试验证**: 迁移完成后进行基础功能测试

## Ionic到UniApp组件映射

| Ionic组件 | UniApp组件 | 说明 |
|-----------|-----------|------|
| ion-app | - | UniApp不需要 |
| ion-content | view/scroll-view | 内容容器 |
| ion-button | button | 按钮 |
| ion-input | input | 输入框 |
| ion-item | view | 列表项 |
| ion-label | text | 标签 |
| ion-modal | uni-popup | 模态框 |
| ion-loading | uni.showLoading | 加载提示 |
| ion-select | picker | 选择器 |
| ion-icon | uni-icons | 图标 |
| ion-list | view | 列表 |

## API映射

| Ionic API | UniApp API | 说明 |
|-----------|-----------|------|
| router.push | uni.navigateTo | 页面跳转 |
| router.replace | uni.redirectTo | 页面替换 |
| alertController | uni.showModal | 模态框 |
| loadingController | uni.showLoading | 加载 |
| toastController | uni.showToast | 提示 |
| menuController | - | UniApp使用tabbar或自定义导航 |

## 存储方案迁移

### rxdb -> uni.storage

```javascript
// rxdb
await db.persons.insert(personData)
const persons = await db.persons.find().exec()

// uni.storage
uni.setStorageSync('persons', personsData)
const persons = uni.getStorageSync('persons') || []
```

## 注意事项

1. UniApp使用条件编译来处理平台差异
2. 路由配置在pages.json中，不是通过vue-router
3. 组件注册需要符合UniApp规范
4. 样式单位使用rpx而不是px
5. 图标使用uni-icons而不是ionicons
