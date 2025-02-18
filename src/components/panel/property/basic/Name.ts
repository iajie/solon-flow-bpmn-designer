import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class Name extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'name';
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.name || '');
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('name', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}