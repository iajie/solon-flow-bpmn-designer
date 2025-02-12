import { EasyBpmnDesigner } from "./core/EasyBpmnDesigner.ts";

// @ts-ignore
window.easyBpmnDesigner = new EasyBpmnDesigner({
    container: '#easy-bpmn-designer',
    i18n: {
        zh: {

        }
    },
    onChange: (options) => {
        console.log(options);
    }
});