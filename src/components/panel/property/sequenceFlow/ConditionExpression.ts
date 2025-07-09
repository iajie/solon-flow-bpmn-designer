import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateCondition } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";
import {AreaEditor} from "../../../../utils/areaEditor.ts";

export class ConditionExpression extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'conditionExpression';
        this.init();
    }

    init() {
        this.inputElement = document.createElement('textarea');
        this.inputElement.style.minHeight = '100px';
        new AreaEditor(this.inputElement);
    }

    onChange(element: BpmnElement) {
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression'));
        this.inputElement && (this.inputElement.value = element.businessObject.conditionExpression?.body || "");
    }

    updateElement(element: BpmnElement) {
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression'));
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateCondition('expression', value, element, modeler);
    }
}
