import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

/**
 * 审批人属性-处理人
 */
export class CandidateGroups extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'candidateGroups';
        this.type = 'text';
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('candidateGroups', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.candidateGroups || '');
    }
}