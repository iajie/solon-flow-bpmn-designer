import BpmnModeler from "bpmn-js/lib/Modeler";
import {EasyBpmnDesignerOptions} from "../../types/easy-bpmn-designer.ts";
import {DesignerEventListener} from "../../core/EasyBpmnDesigner.ts";

export class AbstractToolBar extends HTMLElement implements DesignerEventListener {

    template: string = '';
    modeler?: BpmnModeler;
    options?: EasyBpmnDesignerOptions;

    protected constructor() {
        super();
    }

    protected registerClickListener() {
        this.addEventListener("click", () => {
            this.onClick();
        })
    }

    connectedCallback() {
        this.innerHTML = this.template;
    }

    onClick() {

    }

    onCreate(modeler: BpmnModeler, options: EasyBpmnDesignerOptions): void {
        this.modeler = modeler;
        this.options = options;
    }

}