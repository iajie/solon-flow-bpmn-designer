import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

/**
 * 高级设置-处理人为空时的处理方式
 */
export class AssigneeEmpty extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'assigneeEmpty';
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('emptyHandlerType', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.emptyHandlerType || 'autoApprove');
    }
}