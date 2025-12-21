import bpmnIcon from './bpmn-icon-zh.ts';

export const zh = {
    ...bpmnIcon,
    'import': '导入流程文件',
    'download': '下载流程文件',
    'preview-yaml': '预览 YAML',
    'preview-json': '预览 JSON',
    'save': '保存流程 (Ctrl+S)',
    'undo': '撤销 (Ctrl+Z)',
    'redo': '重做 (Ctrl+Y)',
    'zoom-in': '放大 (+)',
    'zoom-out': '缩小 (-)',
    'reset': '重置缩放',
    'simulation': '流程模拟',
    'minimap': '小地图',

    'basic': '基础设置',
    'id': '节点标识',
    'name': '节点名称',

    'conditionProps': '条件属性',
    'conditionExpression': '条件表达式',
    'conditionType': '条件类型',
    'noCondition': '无条件',
    'priority': '优先级',

    'china': 'China 配置',
    'driver': '驱动',
    'meta': '元数据',
    'when': '执行条件',
    'task': '执行任务脚本',
    'metaTitle': '元数据编辑（YAML/JSON）',
    'script': '任务编辑（#子链、@组件、$脚本引用、脚本代码）',
    'whenTitle': '条件编辑（逻辑表达式）',

    'extendedAttributes': '拓展属性',
    'key': '属性',
    'type': '类型',
    'value': '值',
    'action': '操作',
    'del': '删除',

    'string': '文本',
    'text': '长文本',
    'number': '数字',
    'date': '日期',
    'boolean': '布尔',
    'enum': '枚举'
} as any;
