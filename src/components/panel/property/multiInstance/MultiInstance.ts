import { PanelInput } from "../PanelInput.ts";
import { t } from "i18next";
import Modeler from "bpmn-js/lib/Modeler";
import { updateMultiInstance } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

const options = ['no', 'parallel', 'sequential'];

export class MultiInstance extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'multiInstance';
        this.init();
    }

    init() {
        const select = document.createElement('select');
        for (let option of options) {
            const optionDom = document.createElement('option');
            optionDom.text = t(option);
            optionDom.value = option;
            select.appendChild(optionDom);
        }
        this.inputElement = select;
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        const loopCharacteristics = element.businessObject.loopCharacteristics;

        this.inputElement && (this.inputElement.value = loopCharacteristics
            ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics"
                ? loopCharacteristics.isSequential ? "sequential" : "parallel" : ""
            : "");
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateMultiInstance(value == 'no' ? '' : value, element, modeler);
    }

}