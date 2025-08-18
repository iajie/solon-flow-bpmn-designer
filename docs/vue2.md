# Vue2集成
?>组件封装代码

## 组件封装
```vue
<template>
    <div id="designer"></div>
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
            type: {
                type: String,
                default: "yaml"
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
                container: '#designer',
                height: this.height,
                lang: this.lang,
                theme: this.theme,
                value: this.value,
                onChange: (callback) => {
                    this.$emit("change", callback(this.type))
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
        <solon-flow-designer ref="designer" :value="value" :theme="theme" :lang="lang" :type="type" :height="95" @change="onChange"/>
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
        onChange(data) {
            this.value = data;
        },
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