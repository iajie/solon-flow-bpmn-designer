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
