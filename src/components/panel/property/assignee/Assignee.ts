import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

/**
 * 审批人属性-处理人
 */
export class Assignee extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'assignee';
        this.type = 'text';
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('assignee', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.assignee || '');
    }
}