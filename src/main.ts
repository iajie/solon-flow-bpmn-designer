import { SolonFlowBpmnDesigner } from "./core";
import { downloadFile } from "./utils/bpmnUtils.ts";

// @ts-ignore
window.designer = new SolonFlowBpmnDesigner({
    container: '#easy-bpmn-designer',
    i18n: {
        zh: {

        }
    },
    toolbarKeys: [{
        html: `下载json`,
        tip: `下载json文件`,
        onClick: (event: MouseEvent, designer: SolonFlowBpmnDesigner) => {
            console.log(event, designer);
            downloadFile(designer.getValue(), "solon-flow.yaml");
        }
    }]
});

// @ts-ignore
// window.viewer = new SolonFlowBpmnViewer({
//     container: '#solon-bpmn-viewer',
//     mode: "active",
//     onClick: async (node) => {
//         console.log(node)
//         return node;
//     },
//     popoverRender: (render) => {
//         const pop = document.createElement("div");
//         const title = document.createElement("p");
//         title.textContent = `节点ID：${render.id}`;
//         const title2 = document.createElement("p");
//         title2.textContent = `节点类型：${render.$type}`;
//         pop.appendChild(title);
//         pop.appendChild(title2);
//         return pop;
//     },
//     value: "id: sf1\n" +
//         "title: sf1\n" +
//         "layout:\n" +
//         "  - id: step1\n" +
//         "    type: activity\n" +
//         "    title: 发起审批\n" +
//         "    meta: {actor: 刘涛, form: form1}\n" +
//         "    link:\n" +
//         "    - {nextId: step2}\n" +
//         "  - id: step2\n" +
//         "    type: activity\n" +
//         "    title: 抄送\n" +
//         "    meta: {cc: 吕方}\n" +
//         "    task: '@OaMetaProcessCom'\n" +
//         "    link:\n" +
//         "    - {nextId: step3}\n" +
//         "  - id: step3\n" +
//         "    type: activity\n" +
//         "    title: 审批\n" +
//         "    meta: {actor: 陈鑫, cc: 吕方}\n" +
//         "    task: '@OaMetaProcessCom'\n" +
//         "    link:\n" +
//         "    - {nextId: step4}\n" +
//         "  - id: step4\n" +
//         "    type: parallel\n" +
//         "    title: 审批\n" +
//         "    link:\n" +
//         "    - {nextId: step4_1}\n" +
//         "    - {nextId: step4_2}\n" +
//         "  - id: step4_1\n" +
//         "    type: activity\n" +
//         "    meta: {actor: 陈宇}\n" +
//         "    link:\n" +
//         "    - {nextId: step4_end}\n" +
//         "  - id: step4_2\n" +
//         "    type: activity\n" +
//         "    meta: {actor: 吕方}\n" +
//         "    link:\n" +
//         "    - {nextId: step4_end}\n" +
//         "  - id: step4_end\n" +
//         "    type: parallel\n" +
//         "    link:\n" +
//         "    - {nextId: step5}\n" +
//         "  - id: step5\n" +
//         "    type: activity\n" +
//         "    title: 抄送\n" +
//         "    meta: {cc: 吕方}\n" +
//         "    task: '@OaMetaProcessCom'\n" +
//         "    link:\n" +
//         "    - {nextId: step6}\n" +
//         "  - {id: step6, type: end, title: 结束}\n" +
//         "stateful: {step1: COMPLETED, step2: COMPLETED, step3: COMPLETED, step4: COMPLETED}"
// })
