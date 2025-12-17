import { PanelInput } from "../PanelInput.ts";
import { t } from "i18next";
import {updateCondition} from "../../../../utils/bpmnUtils.ts";
import { Element, Modeler } from "bpmn-js";

const options = [
    {label: 'noCondition', value: ''},
    {label: 'conditionExpression', value: 'expression'}
];

export class ConditionType extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'conditionType';
        this.init();
    }

    init() {
        const select = document.createElement('select');
        for (let option of options) {
            const optionDom = document.createElement('option');
            optionDom.text = t(option.label);
            optionDom.value = option.value;
            select.appendChild(optionDom);
        }
        this.inputElement = select;
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.conditionExpression ? "expression" : "");
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateCondition(value, '', element, modeler);
    }
}
