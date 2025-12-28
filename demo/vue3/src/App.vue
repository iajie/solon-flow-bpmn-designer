<template>
  <div>
      <n-button v-show="!viewer" @click="setProps('lang')">切换语言(当前{{options.lang}})</n-button>
      <n-button v-show="!viewer" @click="setProps('theme')">切换主题({{options.theme}})</n-button>
      <n-button v-show="!viewer" @click="designer.panelShow()">属性面板显隐</n-button>
      <n-button @click="viewer = true; mode = false">->流程图</n-button>
      <n-button v-show="viewer" @click="mode = true">活动流程图</n-button>
      <n-button v-show="viewer" @click="viewer = false">流程设计器</n-button>
      <solon-flow-designer ref="designer" v-if="!viewer" v-model="value" :theme="theme" :lang="lang" :type="options.type" :height="95"/>
      <solon-flow-viewer v-if="viewer" :mode="mode"/>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
import { SolonFlowDesigner, SolonFlowViewer } from "./components";

const value = ref<string>('');
const viewer = ref<boolean>(false);
const mode = ref<boolean>(false);
const designer = ref();

const options = ref<{ theme: "light" | "dark"; lang: "en" | "zh", type: "yaml" | "json" }>({
    theme: 'light',
    lang: 'zh',
    type: 'yaml',
});
const theme = ref<"light" | "dark">('light');
const lang = ref<"en" | "zh">('zh');

const setProps = (type: "theme" | "lang") => {
    if (type === "theme") {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
    }else {
        lang.value = lang.value === 'zh' ? 'en' : 'zh'
    }
}

</script>
<style scoped>
</style>
