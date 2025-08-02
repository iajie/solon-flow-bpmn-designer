import { PanelInput } from "../PanelInput.ts";
import { Element, Modeler } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class Name extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'name';
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.name || '');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('name', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
