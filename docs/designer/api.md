# 事件
?> 可通过class对象得到的方法
```javascript
// 定义class，后面的api会使用到
const designer = new SolonFlowBpmnDesigner({
    container: "#solon-flow-bpmn-designer"
});
```

## 设置值
> 设置设计器值，目前仅支持当前设计器导出的结果，非设计器导出结果请使用工具栏文件导入
```javascript
designer.setValue(``);
```
## 获取yaml值
> 获取设计器结果，结果为yaml
```javascript
designer.getValue();
```
## 获取json值
> 获取设计器结果，结果为json
```javascript
designer.getJson();
```
## 获取属性配置
```javascript
designer.getOptions();
```
## 清除设计器
```javascript
designer.clear();
```

## 销毁
```javascript
designer.destroy();
```
## 语言
```javascript
// 值目前只支持en和zh
designer.changeLocal('en');
```
## 切换主题
```javascript
designer.changeTheme('dark');
```
## 小地图
```javascript
designer.toggleMinimap();
```
## 属性面板
> 控制设计器属性面板的显示与隐藏
```javascript
designer.showPanel();
```