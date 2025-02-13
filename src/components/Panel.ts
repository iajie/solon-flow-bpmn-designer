import {DesignerEventListener} from "../core/EasyBpmnDesigner.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {EasyBpmnDesignerOptions} from "../types/easy-bpmn-designer.ts";
import { initPanelKeys } from "./panel/index.ts";
import {AbstractPanel} from "./panel/AbstractPanel.ts";

export class Panel extends HTMLElement implements DesignerEventListener {

    panelDom: AbstractPanel[] = [];

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("easy-bpmn-designer-container-panel");

        for (let dom of this.panelDom) {
            this.appendChild(dom);
        }
    }

    onCreate(modeler: BpmnModeler, options: EasyBpmnDesignerOptions): void {
        initPanelKeys(modeler, options, this.panelDom);
    }

}