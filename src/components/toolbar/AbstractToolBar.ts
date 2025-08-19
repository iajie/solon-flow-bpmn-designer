import {EasyBpmnDesignerOptions} from "../../types/easy-bpmn-designer.ts";
import { DesignerEventListener, SolonFlowBpmnDesigner } from "../../core/EasyBpmnDesigner.ts";
import {Modeler} from "bpmn-js";

export class AbstractToolBar extends HTMLElement implements DesignerEventListener {

    template: string = '';
    modeler?: Modeler;
    options?: EasyBpmnDesignerOptions;
    designer?: SolonFlowBpmnDesigner;

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

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner): void {
        this.modeler = modeler;
        this.options = designer.options;
        this.designer = designer;
    }

}
