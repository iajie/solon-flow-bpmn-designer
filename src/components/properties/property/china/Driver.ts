import { PanelInput } from "../PanelInput.ts";
import { Modeler, Element } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class Driver extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'driver';
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.driver || '');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('driver', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
