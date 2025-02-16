import { AbstractPanel } from "../AbstractPanel.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { EasyBpmnDesignerOptions } from "../../../types/easy-bpmn-designer.ts";

export class PanelInput extends AbstractPanel {

    type!: string;
    inputLabel!: string;
    inputElement!: HTMLInputElement | HTMLSelectElement;
    className!: string;
    customElement!: HTMLDivElement;
    show: boolean = true;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.style.display = this.show ? "grid" : "none";
        this.classList.add('property-item');
        const label = document.createElement('label');
        label.innerText = t(this.inputLabel);
        this.appendChild(label);
        if (this.customElement) {
            this.appendChild(this.customElement);
        } else {
            const dom = document.createElement('div');
            dom.classList.add("input-wrapper");
            if (this.className) {
                dom.classList.add(this.className);
            }
            if (!this.inputElement) {
                this.inputElement = document.createElement('input');
                this.inputElement.type = this.type;
            }
            this.inputElement.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
            this.inputElement.oninput = (e) => this.onChangeValue(e, this.element, this.modeler);
            dom.appendChild(this.inputElement);
            this.appendChild(dom);
        }
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: BpmnModeler) {
        console.log('onChangeValue', e, element, modeler);
    }

    onCreate(modeler: BpmnModeler, options: EasyBpmnDesignerOptions) {
        this.modeler = modeler;
        super.onCreate(modeler, options);
    }

    onChange(element: BpmnElement) {
        this.element = element;
        // this.inputElement && (this.inputElement.value = element.id);
    }

}