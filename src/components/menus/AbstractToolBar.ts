import { Modeler } from "bpmn-js";
import { DesignerEventListener, SolonFlowBpmnDesigner, SolonFlowBpmnDesignerOptions } from "../../core";

export class AbstractToolBar extends HTMLElement implements DesignerEventListener {

    template: string = '';
    modeler?: Modeler;
    options?: SolonFlowBpmnDesignerOptions;
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
