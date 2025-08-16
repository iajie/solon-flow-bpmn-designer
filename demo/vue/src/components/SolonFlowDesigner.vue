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
