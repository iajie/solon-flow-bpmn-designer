import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class FormPrimaryKey extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'formPrimaryKey';
    }


    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.formKey || '');
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('formKey', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}