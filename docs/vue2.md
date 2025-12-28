# Vue2集成
?>组件封装代码

## 组件封装
```vue
<template>
    <div id="solon-flow-bpmn-designer"></div>
</template>
<script>
    import "solon-flow-bpmn-designer/style.css";
    import { SolonFlowBpmnDesigner } from "solon-flow-bpmn-designer";
    export default {
        name: 'SolonFlowDesigner',
        props: {
            value: {
                type: String,
                required: true
            },
            theme: {
                type: String,
                default: "light"
            },
            lang: {
                type: String,
                default: "zh"
            },
            height: {
                type: Number,
                default: 60
            },
        },
        data() {
            return {
                designer: null,
            }
        },
        mounted() {
            this.designer = new SolonFlowBpmnDesigner({
                container: '#solon-flow-bpmn-designer',
                height: this.height,
                lang: this.lang,
                theme: this.theme,
                value: this.value,
                onChange: (callback) => {
                    this.$emit("input", callback())
                },
            });
        },
        methods: {
            panelShow() {
                this.designer?.showPanel();
            },
            clear() {
                this.designer?.clear();
            },
            getValue() {
                return this.designer?.getValue();
            }
        },
        watch: {
            lang: {
                handler(val) {
                    if (val && this.designer) {
                        this.designer.changeLocal(val);
                    }
                },
                deep: true,
                immediate: true
            },
            theme: {
                handler(val) {
                    if (val && this.designer) {
                        this.designer.changeTheme(val);
                    }
                },
                deep: true,
                immediate: true
            },
        },
    }
</script>
```
## 使用代码
```vue
<template>
    <div>
        <button @click="setProps('lang')">切换语言(当前{{lang}})</button>
        <button @click="setProps('theme')">切换主题({{theme}})</button>
        <button @click="panelShow">属性面板显隐</button>
        <solon-flow-designer ref="designer" v-model="value" :theme="theme" :lang="lang" :type="type" :height="90"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            designer: null,
            theme: 'light',
            lang: 'zh',
            type: 'yaml',
        }
    },
    methods: {
        setProps(type) {
            if (type === "theme") {
                this.theme = this.theme === 'dark' ? 'light' : 'dark';
            }else {
                this.lang = this.lang === 'zh' ? 'en' : 'zh'
            }
        },
        panelShow() {
            console.log(this.$refs.designer.panelShow());
            // this.$refs.designer.panelShow();
        }
    }
}
</script>
```

## 流程图组件封装
```vue
<template>
    <div>
        <div id="solon-flow-bpmn-viewer"></div>
        <el-popover v-if="mode" width="200" placement="top" trigger="click" :title="popover.name || popover.id">
            <!--    这里是弹框内容        -->
            <el-descriptions title="用户信息" :column="1">
                <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
                <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
                <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
                <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            </el-descriptions>
            <div slot="reference" :style="{
                 width: `${popover.width}px`,
                 height: `${popover.height}px`,
                 display: `${popover.display}`,
                 position: 'fixed',
                 zIndex: 1000,
                 top: `${popover.top}px`,
                 left: `${popover.left}px`,
            }"/>
        </el-popover>
    </div>
</template>
<script>
import "solon-flow-bpmn-designer/style.css";
import { SolonFlowBpmnViewer } from "solon-flow-bpmn-designer";

export default {
    name: 'SolonFlowViewer',
    props: {
        value: {
            type: String | Object,
            required: true
        },
        height: {
            type: Number,
            default: 60
        },
        mode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            viewer: null,
            popover: {},
            visible: false,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.viewer = new SolonFlowBpmnViewer({
                container: '#solon-flow-bpmn-viewer',
                height: this.height,
                value: this.mode ? this.value : this.value.data,
                toolbar: this.mode,
                onClick: (element, svg) => {
                    const position = svg.getBoundingClientRect();
                    this.popover = {
                        ...element,
                        display: 'block',
                        width: position.width,
                        height: position.height,
                        top: position.y,
                        left: position.x,
                    };
                },
            });
        }
    },
    watch: {
        mode: {
            handler(val) {
                if (this.viewer) {
                    this.viewer.destroy();
                }
                this.init();
            },
            deep: true,
            immediate: true
        }
    },
}
</script>
```