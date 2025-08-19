import { AbstractPanel } from "./AbstractPanel.ts";
import { Modeling, Modeler } from "bpmn-js";
import { initPanelContent } from "./index.ts";
import { SolonFlowBpmnDesigner } from "../../core/EasyBpmnDesigner.ts";

export class Property extends AbstractPanel {

    content: AbstractPanel[] = [];

    activeKey: string = 'basic';

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        for (let dom of this.content) {
            this.appendChild(dom);
        }
    }

    onActiveKeyChange(activeKey: string) {
        this.activeKey = activeKey;
    }

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner) {
        super.onCreate(modeler, designer);
        this.style.height = `calc(${ this.options?.height } - 90px)`;
        initPanelContent(modeler, designer, this);
    }

    bpmnFactory() {
        return this.modeler?.get('bpmnFactory');
    }

    modeling() {
        return this.modeler?.get('modeling') as Modeling;
    }

}
