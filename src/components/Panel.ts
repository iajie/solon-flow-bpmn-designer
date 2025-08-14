import {DesignerEventListener} from "../core/EasyBpmnDesigner.ts";
import {EasyBpmnDesignerOptions} from "../types/easy-bpmn-designer.ts";
import { initPanelKeys } from "./panel/index.ts";
import {AbstractPanel} from "./panel/AbstractPanel.ts";
import {Modeler} from "bpmn-js";
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

    onCreate(modeler: Modeler, options: EasyBpmnDesignerOptions): void {
        initPanelKeys(modeler, options, this.panelDom);
        this.style.maxHeight = `${options.height || '70'}vh`;
    }

}
