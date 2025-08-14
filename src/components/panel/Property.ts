import { AbstractPanel } from "./AbstractPanel.ts";
import { Modeling, Modeler } from "bpmn-js";
import { EasyBpmnDesignerOptions } from "../../types/easy-bpmn-designer.ts";
import { initPanelContent } from "./index.ts";

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

    onCreate(modeler: Modeler, options: EasyBpmnDesignerOptions) {
        super.onCreate(modeler, options);
        this.style.height = `calc(${ this.options?.height } - 90px)`;
        initPanelContent(modeler, options, this);
    }

    bpmnFactory() {
        return this.modeler?.get('bpmnFactory');
    }

    modeling() {
        return this.modeler?.get('modeling') as Modeling;
    }

}
