import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class ID extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'id';
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.id);
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: BpmnModeler) {
        updateProperty('id', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}