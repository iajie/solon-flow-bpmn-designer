## Solon-Flow-Bpmn-Designer设计器属性

### 基础属性
| 属性名                | 类型                                                               | 默认值                     | 描述                                  | 是否必填 |
|--------------------|------------------------------------------------------------------|-------------------------|-------------------------------------|------|
| container          | Element丨string                                                   | -                       | 挂载dom/id                            | 是    |
| value              | string                                                           | -                       | bpmn2.0 xml数据/solon-flow(yaml/json) | 否    |
| valueType          | json 丨 yaml                                                      | yaml                    | 值类型                                 | 否    |
| theme              | dark 丨 light                                                     | light                   | 主题(明亮/暗黑)                           | 否    |
| lang               | zh 丨 en                                                          | en                      | 语言                                  | 否    |
| i18n               | {}                                                               | -                       | 国际化配置                               | 否    |
| height             | number                                                           | 60                      | 设计器可视高度                             | 否    |
| additionalModels   | ModuleDeclaration[]                                              | -                       | 用户自定义扩展模块(基于bpmn)，需要有bpmn设计器的基础     | 否    |
| gridLine           | [gridLine](#设计器背景表格)                                             | -                       | 设计器背景网格配置                           | 否    |
| colors             | [colors](#颜色自定义)                                                 | -                       | 元素颜色自定义(会覆盖原来的定义)                   | 否    |
| minimap            | { `open: boolean; position: { x: number; y: 'bottom' 丨 number }` } | -                       | 小地图                                 | 否    |
| toolbarExcludeKeys | string[]                                                         | -                       | 工具栏排除                               | 否    |
| toolbarSize        | string丨small丨medium丨large                                        | small                   | 工具栏大小                               | 否    |
| onSelect           | (element: Element) => void                                       | -                       | 监听选择节点                              | 否    |
| onChange           | (callback: (valueType?: "json"丨"yaml") => any) => void           | -     | 监听结果变化参数为回调可设置结果类型                  | 否    |
| onXmlError         | (error: Error丨string) => void                                    | -     | bpmn导入加载错误                          | 否    |
| onCreated          | (modeler: Modeler) => void                                       | -     | 实例创建完成事件                            | 否    |
| onDestroy          | (designer: SolonFlowBpmnDesigner) => void                        | -     | 销毁实例                                | 否    |
| toolbarKeys        | [自定义工具栏案例](toolbar.md#自定义工具栏)                                    | -     | 自定义工具栏属性                            | 否    |


### 设计器背景表格
| 属性名              | 类型     | 默认值  | 描述      |
|------------------|--------|------|---------|
| smallGridSpacing | number | 20   | 最小网格边长  |
| gridSpacing      | number | 80   | 大号网格边长  |
| gridLineStroke   | number | 0.5  | 网格边框宽度  |
| gridLineOpacity  | number | 0.6  | 网格边框透明度 |
| gridLineColor    | string | #ccc | 网格边框颜色  |


### 颜色自定义
| 属性名     | 类型     | 默认值 | 描述      |
|---------|--------|---|---------|
| label   | string | - | 颜色描述    |
| fill    | string | - | 元素填充颜色  |
| stroke  | string | - | 元素边框颜色  |