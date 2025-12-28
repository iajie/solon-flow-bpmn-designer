## Solon-Flow-Bpmn-Viewer流程图属性

### 基础属性
| 属性名             | 类型                                                       | 默认值    | 描述                                               | 是否必填 |
|-----------------|----------------------------------------------------------|--------|--------------------------------------------------|------|
| container       | Element丨string                                           | -      | 挂载dom/id                                         | 是    |
| value           | string 丨 [NodeType](#NodeType值类型)                        | -      | bpmn2.0 xml数据/solon-flow(yaml/json)              | 否    |
| height          | number                                                   | 50     | 设计器可视高度                                          | 否    |
| excludeType     | string[]                                                 | -      | 排除点击的元素类型                                        | 否    |
| toolbar         | `boolean`                                                | `true` | 工具栏(放大、缩小、下载)                                    | 否    |
| customDownload  | `(viewer: HTMLElement) => void`                          | -      | `针对下载图片没有样式，可以通过得到流程图dom配合第三方库进行导出例如html2canvas` | 否    |
| onClick  | `(node: Element, graphics: SVGElement) => Promise<void>` | -      | `自定义点击事件，可以拿到点击的节点信息，以及点击的节点位置，方便弹框`             | 否    |

## NodeType值类型
| 属性名      | 类型              | 默认值  | 描述                     | 是否必填 |
|----------|-----------------|------|------------------------|------|
| data     | string          | -    | `solon-flow yaml/json` | 是    |
| stateful | [Stateful[]](#Stateful类型) | -    | 节点状态                   | 否    |

## Stateful类型
| 属性名           | 类型                                                         | 默认值  | 描述                                                       | 是否必填 |
|---------------|------------------------------------------------------------|------|----------------------------------------------------------|------|
| stateType     | string                                                     | -    | [`solon-flow节点状态`](https://solon.noear.org/article/1264) | 是    |
| activeNodeIds | string[]                                                   | -    | 激活的节点id列表                                                | 否    |
| activeColor   | `'success'丨'process'丨'danger'丨'warning'丨'cyan'丨'purple'`   | -    | 激活的节点的样式                                                 | 是    |

