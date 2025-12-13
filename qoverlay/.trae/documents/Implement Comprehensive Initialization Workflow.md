# 实现综合初始化工作流

## 1. 安装依赖
- 安装 `@capacitor/preference` 包用于存储首次使用时间

## 2. 创建初始化服务
- 创建 `src/services/initService.ts` 用于管理初始化逻辑
- 实现首次使用时间检查和记录功能
- 实现数据库初始化管理

## 3. 修改 App.vue
- 添加加载状态管理
- 集成初始化服务
- 实现初始化模态框

## 4. 初始化模态框实现
- 创建 `src/components/InitModalComponent.vue` 组件
- 实现欢迎信息和个人信息表单
- 添加表单验证逻辑
- 实现确认按钮功能

## 5. 人员 ID 生成重构
- 修改 `dbService.ts` 中的人员 ID 生成逻辑，使用时间戳作为主要标识符
- 确保新 ID 生成方式在整个应用中一致使用

## 6. 集成与测试
- 将初始化工作流集成到应用启动流程中
- 测试首次启动和后续启动的不同行为
- 验证数据库初始化和人员数据存储

## 实现细节

### 首次使用时间记录
- 使用 `@capacitor/preference` API 存储和检查 `firstUseTime` 偏好
- 在应用启动时检查该偏好，决定是否执行完整初始化流程

### 应用启动加载状态
- 在 App.vue 中添加加载指示器
- 执行数据库初始化时显示加载状态
- 初始化完成后隐藏加载状态，进入主应用界面

### 初始化模态框
- 包含欢迎信息和个人信息表单
- 表单字段：姓名（默认"我"）、身高（默认170）、体重（默认55）、年龄（必填）
- 确认按钮位于模态框底部
- 表单验证确保必填字段已填写
- 提交后将用户信息存储到数据库，ID 设为"me"

### 人员 ID 生成重构
- 将现有 ID 生成逻辑从 `person_${Date.now()}_${random}` 改为 `person_${Date.now()}`
- 确保唯一性的同时简化 ID 结构

## 技术栈
- Vue 3 + TypeScript
- Ionic Vue 组件库
- RxDB 数据库
- @capacitor/preference API

## 文件修改

### 新增文件
- `src/services/initService.ts` - 初始化服务
- `src/components/InitModalComponent.vue` - 初始化模态框组件

### 修改文件
- `src/main.ts` - 集成初始化逻辑
- `src/App.vue` - 添加加载状态和模态框
- `src/services/dbService.ts` - 重构人员 ID 生成逻辑
- `package.json` - 添加 @capacitor/preference 依赖