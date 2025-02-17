import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class AdvancedGroup extends PanelInput {

    option: { label: string; value: string }[] = [];
    key!: 'returnType' | 'emptyHandlerType';
    value!: string;
    defaultValue!: string;
    constructor() {
        super();
    }

    init() {
        const radioGroup = document.createElement('div');
        radioGroup.classList.add('input-wrapper');
        radioGroup.classList.add('radio-group');
        if (this.option && this.option.length) {
            for (let item of this.option) {
                const label = document.createElement('label');
                label.classList.add('radio-item');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = this.key;
                radio.value = item.value;
                radio.onchange = (e) => this.onChangeValue(e, this.element, this.modeler)
                label.appendChild(radio);
                const span = document.createElement('span');
                span.innerText = item.label;
                label.appendChild(span);
                radioGroup.appendChild(label);
            }
        }
        this.customElement = radioGroup;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty(this.key, (e.target as HTMLInputElement).value, element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.value && (this.value = element.businessObject[this.key] || this.defaultValue);
    }
}