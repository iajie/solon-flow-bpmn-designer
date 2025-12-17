import { DesignerEventListener, SolonFlowBpmnDesigner } from "../core";
import { initPanelKeys, AbstractPanel } from "./properties";
import { Modeler } from "bpmn-js";
import { defineCustomElement } from "../utils/domUtils.ts";
import { CodeHighlight } from "./CodeHighlight.ts";

defineCustomElement("easy-bpmn-code-highlight", CodeHighlight);

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

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner): void {
        initPanelKeys(modeler, designer, this.panelDom);
        this.style.maxHeight = `${designer.options.height || '70'}vh`;
    }

}
