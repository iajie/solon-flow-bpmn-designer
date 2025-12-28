# 事件
?> 可通过class对象得到的方法
```javascript
// 定义class，后面的api会使用到
const designer = new SolonFlowBpmnViewer({
    container: "#solon-flow-bpmn-viewer"
});
```

## 获取工具栏
> 获取工具栏dom
```javascript
designer.getToolbar();
```
## 获取bpmn
> 获取流程图对象，得到bpmn API
```javascript
designer.getModeler();
```
## 设置节点颜色
> 通过该方法可以将节点增加样式
> 样式主题'success' | 'process' | 'danger' | 'warning' | 'cyan' | 'purple';
```javascript
designer.setNodeColor(nodeIds, 'danger');
```
## 销毁
```javascript
designer.destroy();
```