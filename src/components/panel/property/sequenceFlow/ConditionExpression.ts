import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateCondition } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

export class ConditionExpression extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'conditionExpression';
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.conditionExpression?.body || "");
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateCondition('expression', value, element, modeler);
    }
}