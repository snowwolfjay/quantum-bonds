# 改进PersonInputComponent组件

## 实现目标

1. **新增属性**：为Person接口添加年龄和称呼属性
2. **人员管理**：实现人员选择、添加和编辑功能
3. **UI改进**：默认显示人员选择，选择后展示详细信息
4. **模态框**：点击人员选择打开modal，展示人员列表和添加功能

## 实现步骤

### 1. 修改数据结构
- **Person接口**：添加`age: number | null`和`name: string`属性
- **人员列表**：创建一个全局或组件内的人员列表存储

### 2. 改进PersonInputComponent.vue

#### 2.1 修改模板
- **展示视图**：添加年龄和称呼的显示
- **选择按钮**：添加人员选择按钮
- **人员管理modal**：添加包含人员列表和添加功能的modal

#### 2.2 修改组件逻辑
- **props和emit**：修改props和emit以支持人员管理
- **人员列表管理**：实现人员的添加、编辑和选择功能
- **模态框控制**：实现人员选择和编辑模态框的控制

### 3. 更新计算组件
- **QuickCalcComponent.vue**：更新使用新的PersonInputComponent
- **PreciseCalcComponent.vue**：更新使用新的PersonInputComponent

### 4. 实现人员管理功能
- **人员列表展示**：在modal中展示人员概要信息
- **人员添加**：实现添加新人员的功能
- **人员编辑**：实现编辑现有人员属性的功能
- **人员选择**：实现选择人员并展示详细信息的功能

### 5. 样式优化
- 优化modal布局和样式
- 优化人员列表展示样式
- 优化人员信息展示样式

## 预期效果

1. 组件默认显示人员选择状态
2. 点击选择按钮打开人员管理modal
3. modal中可以查看现有人员、添加新人员或编辑人员信息
4. 选择人员后，组件展示该人员的详细信息
5. 支持编辑人员的所有属性，包括新增的年龄和称呼

## 文件修改列表

1. **src/components/PersonInputComponent.vue**：主要修改文件
2. **src/components/QuickCalcComponent.vue**：更新使用新组件
3. **src/components/PreciseCalcComponent.vue**：更新使用新组件
4. **src/i18n/messages/zh.json**：添加新属性的翻译
5. **src/i18n/messages/en.json**：添加新属性的翻译