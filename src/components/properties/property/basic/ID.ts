import { PanelInput } from "../PanelInput.ts";
import { Element, Modeler } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class ID extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'id';
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.id);
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('id', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
