import BpmnModeler from "bpmn-js";
import { EasyBpmnDesigner } from "./core/EasyBpmnDesigner.ts";

// @ts-ignore
window.easyBpmnDesigner = new EasyBpmnDesigner({
    container: '#easy-bpmn-designer',
    i18n: {
        zh: {

        }
    },
    onChange: (callback) => {
        console.log("change", callback());
    },
    onSelect: (element) => {
        console.log("selected", element)
    },
    onXmlError: (error: Error | string) => {
        console.log("xmlError", error);
    },
    onCreated: (modeler: BpmnModeler) => {
        console.log("created", modeler);
    }
});
