import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class FormEditable extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'allowEditing';
        this.init();
    }

    init() {
        const dom = document.createElement('div');
        dom.classList.add('input-wrapper');
        dom.classList.add('switch-wrapper');
        const label = document.createElement('label');
        label.classList.add('switch');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
        this.inputElement = input;
        label.appendChild(this.inputElement);
        const span = document.createElement('span');
        span.classList.add('slider');
        label.appendChild(span);
        dom.appendChild(label);
        this.customElement = dom;
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement.value = element.businessObject.formEditable === undefined ? false : element.businessObject.formEditable;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('formEditable', (e.target as HTMLInputElement).checked || false, element, modeler);
    }
}