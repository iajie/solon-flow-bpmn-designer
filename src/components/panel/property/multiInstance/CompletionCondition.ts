import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

export class CompletionCondition extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'completionCondition';
    }

    onChange(element: BpmnElement) {
        const loopCharacteristics = element.businessObject.loopCharacteristics;
        this.onShow(loopCharacteristics ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics" : false)
        this.inputElement && (this.inputElement.value = loopCharacteristics?.loopCardinality?.body || "");
    }

    updateElement(element: BpmnElement) {
        const loopCharacteristics = element.businessObject.loopCharacteristics;
        this.onShow(loopCharacteristics ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics" : false);
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('completionCondition', (e.target as HTMLInputElement).value || '', element, modeler);
    }

}