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
