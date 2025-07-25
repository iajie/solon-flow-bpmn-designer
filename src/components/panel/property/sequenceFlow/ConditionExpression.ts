import { PanelInput } from "../PanelInput.ts";
import { updateCondition } from "../../../../utils/bpmnUtils.ts";
import { Modeler, Element } from "bpmn-js";
import { AreaEditor } from "../../../../utils/areaEditor.ts";

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

    onChange(element: Element) {
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression'));
        this.inputElement && (this.inputElement.value = element.businessObject.conditionExpression?.body || "");
    }

    updateElement(element: Element) {
        console.log(element.businessObject)
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression'));
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateCondition('expression', value, element, modeler);
    }
}
