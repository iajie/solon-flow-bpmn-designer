import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

export class LoopCardinality extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'loopCardinality';
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        const loopCharacteristics = element.businessObject.loopCharacteristics;
        this.show = loopCharacteristics ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics" : false;
        this.inputElement && (this.inputElement.value = loopCharacteristics?.loopCardinality?.body || "");
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('loopCardinality', (e.target as HTMLInputElement).value || '', element, modeler);
    }

}