import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class GatewayCondition extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'conditionExpression';
    }


    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('conditionExpression', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.conditionExpression?.body || '');
    }
}