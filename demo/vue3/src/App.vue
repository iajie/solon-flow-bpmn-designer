<template>
  <div>
      <button @click="setProps('lang')">切换语言(当前{{options.lang}})</button>
      <button @click="setProps('theme')">切换主题({{options.theme}})</button>
      <button @click="designer.panelShow()">属性面板显隐</button>
      <solon-flow-designer ref="designer" :value="value" :theme="theme" :lang="lang"
                           :type="options.type" :height="95" @change="onChange"/>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import SolonFlowDesigner from "./components/SolonFlowDesigner.vue";

const value = ref<string>('');
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

const onChange = (data: string) => {
    console.log(data);
    value.value = data;
}

</script>
<style scoped>
</style>
