import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class Driver extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'driver';
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.driver || '');
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('driver', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
