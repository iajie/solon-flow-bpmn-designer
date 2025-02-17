import {PanelInput} from "../PanelInput.ts";
import {t} from "i18next";
import Modeler from "bpmn-js/lib/Modeler";
import {updateProperty} from "../../../../utils/bpmnUtils.ts";
import {BpmnElement} from "bpmn-js";

const options = [
    {label: 'pleaseSelect', value: ''},
    {label: 'autoPass', value: 'auto_pass'},
    {label: 'autoReject', value: 'auto_reject'},
    {label: 'alert', value: 'alert'},
];

export class TimeoutStrategy extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'timeoutStrategy';
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

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.timeoutStrategy || "");
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        updateProperty('timeoutStrategy', value, element, modeler);
    }
}