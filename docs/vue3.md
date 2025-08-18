# Vue3集成

## 组件封装

```vue
<template>
    <div ref="designer"></div>
</template>
<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from "vue";
import "solon-flow-bpmn-designer/style.css";
import { SolonFlowBpmnDesigner } from "solon-flow-bpmn-designer";

interface SolonFlowDesignerProps {
    value: string;
    theme?: "light" | "dark";
    lang?: "en" | "zh";
    type?: "yaml" | "json";
    height?: number;
}

interface SolonFlowDesignerRef {
    /** 属性面板显隐控制 */
    panelShow: () => boolean;
    /** 清除设计器 */
    clear: () => void;
    /** 获取值 */
    getValue: () => string | undefined;
}

const props = withDefaults(defineProps<SolonFlowDesignerProps>(), {
    theme: "light",
    lang: "zh",
    type: "yaml",
    height: 60,
});

watch(() => props.theme, (newTheme) => {
    solonDesigner.value?.changeTheme(newTheme);
});
watch(() => props.lang, (newLang) => {
    solonDesigner.value?.changeLocal(newLang);
});

const designer = ref();
const solonDesigner = ref<SolonFlowBpmnDesigner>();
const emit = defineEmits(["change"]);

onMounted(() => {
    solonDesigner.value = new SolonFlowBpmnDesigner({
        container: designer.value,
        height: props.height || 60,
        lang: props.lang || 'zh',
        theme: props.theme || 'light',
        value: props.value,
        onChange: (callback) => {
            emit("change", callback(props.type))
        },
    });
});

onUnmounted(() => solonDesigner.value?.destroy())

/**
 * ref可调用方法
 */
defineExpose<SolonFlowDesignerRef>({
    panelShow: () => solonDesigner.value?.showPanel() || false,
    clear: () => solonDesigner.value?.clear(),
    getValue: () => solonDesigner.value?.getValue(),
});

</script>
```

## 使用代码
 
```vue
<template>
  <div>
      <button @click="setProps('lang')">切换语言(当前{{options.lang}})</button>
      <button @click="setProps('theme')">切换主题({{options.theme}})</button>
      <button @click="designer.panelShow()">属性面板显隐</button>
      <solon-flow-designer ref="designer" :value="value" :theme="theme" :lang="lang" :type="options.type" :height="95" @change="onChange"/>
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
```