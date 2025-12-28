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

type SolonFlowDesignerProps = {
    modelValue: string;
    theme?: "light" | "dark";
    lang?: "en" | "zh";
    type?: "yaml" | "json";
    height?: number;
};

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
const model = defineModel();

onMounted(() => {
    solonDesigner.value = new SolonFlowBpmnDesigner({
        container: designer.value,
        height: props.height || 60,
        lang: props.lang || 'zh',
        theme: props.theme || 'light',
        value: props.modelValue,
        onChange: (callback) => {
            model.value = callback(props.type);
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
      <solon-flow-designer ref="designer" v-model="value" :theme="theme" :lang="lang" :type="options.type" :height="95" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { SolonFlowDesigner } from "./components";

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
    } else {
        lang.value = lang.value === 'zh' ? 'en' : 'zh'
    }
}
</script>
```

## 流程图组件封装
```javascript
<template>
    <div ref="viewer"></div>
    <n-popover :width="200">
        <n-descriptions bordered label-placement="left" :column="1" :title="popover.name || popover.id">
            <n-descriptions-item>
                <template #label>
                    早餐
                </template>
                苹果
            </n-descriptions-item>
            <n-descriptions-item label="早午餐">
                苹果
            </n-descriptions-item>
            <n-descriptions-item label="午餐">
                苹果
            </n-descriptions-item>
            <n-descriptions-item label="晚餐" :span="2">
                两个<br>
                苹果
            </n-descriptions-item>
            <n-descriptions-item label="夜宵">
                苹果
            </n-descriptions-item>
        </n-descriptions>
        <template #trigger>
            <div :style="{
                 width: `${popover.width || 0}px`,
                 height: `${popover.height || 0}px`,
                 display: `${popover.display}`,
                 position: 'fixed',
                 zIndex: 1000,
                 top: `${popover.top || 0}px`,
                 left: `${popover.left || 0}px`,
            }"/>
        </template>
    </n-popover>
</template>
<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from "vue";
import { NPopover, NDescriptions, NDescriptionsItem } from "naive-ui";
import "solon-flow-bpmn-designer/style.css";
import { SolonFlowBpmnViewer } from "solon-flow-bpmn-designer";
import { xmlStr } from "./default.ts";

const viewer = ref();
const solonViewer = ref<SolonFlowBpmnViewer>();
const popover = ref({
    height: 80,
    width: 100,
    display: 'none',
    top: 0,
    left: 0,
});

const props = withDefaults(defineProps<{ mode: boolean }>(), {
    mode: false,
});

watch(() => props.mode, (newTheme) => {
    solonViewer.value?.destroy();
    init(newTheme);
});

const init = (mode: boolean = false) => {
    solonViewer.value = new SolonFlowBpmnViewer({
        container: viewer.value,
        value: !mode ? xmlStr : {
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
        },
        onClick: async (node, graphics) => {
            const position = graphics.getBoundingClientRect();
            popover.value = {
                ...node,
                display: 'block',
                width: position.width,
                height: position.height,
                top: position.y,
                left: position.x,
            }
        },
    });
}

onMounted(() => init());

onUnmounted(() => solonViewer.value?.destroy())
</script>
```