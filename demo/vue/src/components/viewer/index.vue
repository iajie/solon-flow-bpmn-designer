<template>
    <div>
        <div id="solon-flow-bpmn-viewer"></div>
        <el-popover v-if="mode" width="200" placement="top" trigger="click" :title="popover.name || popover.id">
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
