import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";

const autoSkipOptions = [
    { value: "starter", label: "starter" },
    { value: "lastHandler", label: "lastHandler" },
    { value: "approved", label: "approved" },
];

export class AutoSkipOptions extends PanelInput {

    selectedButtons: HTMLInputElement[] = [];

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
            this.selectedButtons.push(input);
            label.appendChild(input);

            const span = document.createElement('span');
            span.innerText = t(item.label);
            label.appendChild(span);

            autoSkipConfig.appendChild(label);
        }

        this.customElement = autoSkipConfig;
    }

    onChangeValue(_e: Event, element: BpmnElement, modeler?: Modeler) {
        const arr = [];
        for (let dom of this.selectedButtons) {
            if (dom.checked) {
                arr.push(dom.value);
            }
        }
        updateProperty('autoSkipType', arr.join(','), element, modeler);
    }

    onChange(element: BpmnElement) {
        const autoSkipType = element.businessObject.autoSkipType;
        const selected = autoSkipType ? autoSkipType.split(',') : [];
        for (let dom of this.selectedButtons) {
            dom.checked = selected.includes(dom.value);
        }
    }
}