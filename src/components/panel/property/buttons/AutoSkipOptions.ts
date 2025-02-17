import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";

const autoSkipOptions = [
    { value: "starter", label: "审批人为发起人" },
    { value: "lastHandler", label: "审批人与上一审批节点处理人相同" },
    { value: "approved", label: "审批人审批过" },
];

export class AutoSkipOptions extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'autoSkipOptions';
        this.init();
    }

    init() {
        const autoSkipConfig = document.createElement('div');
        autoSkipConfig.classList.add('input-wrapper');
        autoSkipConfig.classList.add('auto-skip-config');

        for (let item of autoSkipOptions) {
            const label = document.createElement('label');
            label.classList.add('checkbox-item');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = item.value;
            input.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
            label.appendChild(input);

            const span = document.createElement('span');
            span.innerText = t(item.label);
            label.appendChild(span);

            autoSkipConfig.appendChild(label);
        }

        this.customElement = autoSkipConfig;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        console.log(e);
        updateProperty('autoSkipType', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        const autoSkipType = element.businessObject.autoSkipType;
        this.inputElement && (this.inputElement.value = autoSkipType ? autoSkipType.split(',') : []);
    }
}