<template>
    <div>
        <el-button v-show="!viewer" size="small" @click="setProps('lang')">切换语言(当前{{ lang }})</el-button>
        <el-button v-show="!viewer" size="small" @click="setProps('theme')">切换主题(当前{{ theme }})</el-button>
        <el-button v-show="!viewer" size="small" @click="panelShow">属性面板显隐</el-button>
        <el-button size="small" @click="viewer = true; mode = false">普通流程图</el-button>
        <el-button size="small" @click="mode = true">活动流程图</el-button>
        <el-button size="small" v-show="viewer" @click="viewer = false">流程设计器</el-button>
        <solon-flow-viewer v-if="viewer" :mode="mode" :value="viewerValue"/>
        <solon-flow-designer v-else ref="designer" v-model="value" :theme="theme" :lang="lang" :type="type" :height="90"/>
    </div>
</template>

<script>
import { xmlStr } from "@/default";

export default {
    data() {
        return {
            value: '',
            designer: null,
            theme: 'light',
            lang: 'zh',
            type: 'yaml',
            viewer: false,
            mode: false,
            viewerValue: {
                data: xmlStr,
                stateful: [
                    { stateType: 'WAITING', activeNodeIds: ['step4_1'], activeColor: 'process' },
                    {
                        stateType: 'COMPLETED',
                        activeNodeIds: ['step1', 'step2', 'step3', 'step4'],
                        activeColor: 'success'
                    },
                    { stateType: 'TERMINATED', activeNodeIds: ['step4_2'], activeColor: 'danger' },
                ],
            }
        }
    },
    methods: {
        setProps(type) {
            if (type === "theme") {
                this.theme = this.theme === 'dark' ? 'light' : 'dark';
            } else {
                this.lang = this.lang === 'zh' ? 'en' : 'zh'
            }
        },
        panelShow() {
            // console.log(this.$refs.designer.panelShow());
            // this.$refs.designer.panelShow();
        }
    }
}
</script>
