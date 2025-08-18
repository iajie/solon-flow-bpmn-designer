import { SolonFlowBpmnDesigner } from "./core/EasyBpmnDesigner.ts";
import { Modeler } from "bpmn-js";

// @ts-ignore
window.easyBpmnDesigner = new SolonFlowBpmnDesigner({
    container: '#easy-bpmn-designer',
    i18n: {
        zh: {

        }
    },
    toolbarKeys: [{
        title: `下载json`,
        tip: `下载json文件`,
        onClick: (event: MouseEvent, modeler: Modeler) => {
            console.log(event, modeler);
        }
    }]
    // onChange: (callback) => {
    //     console.log("change", callback());
    // },
    // onSelect: (element) => {
    //     console.log("selected", element)
    // },
    // onXmlError: (error: Error | string) => {
    //     console.log("xmlError", error);
    // },
    // onCreated: (modeler: BpmnModeler) => {
    //     console.log("created", modeler);
    // }
});
