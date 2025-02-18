import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";
import tippy from "tippy.js";

const availableButtons = [
    {
        type: "approve",
        label: "approve",
        tooltip: "approveTip",
    },
    {
        type: "reject",
        label: "reject",
        tooltip: "rejectTip",
    },
    {
        type: "delegate",
        label: "delegate",
        tooltip: "delegateTip",
    },
    {
        type: "transfer",
        label: "transfer",
        tooltip: "transferTip",
    },
    {
        type: "revoke",
        label: "revoke",
        tooltip: "revokeTip",
    },
    {
        type: "returnToNode",
        label: "returnToNode",
        tooltip: "returnToNodeTip",
    },
    {
        type: "returnToStarter",
        label: "returnToStarter",
        tooltip: "returnToStarterTip",
    },
    {
        type: "terminate",
        label: "terminate",
        tooltip: "terminateTip",
    },
    {
        type: "addSign",
        label: "addSign",
        tooltip: "addSignTip",
    },
    {
        type: "counterSignApprove",
        label: "counterSignApprove",
        tooltip: "counterSignApproveTip",
    },
    {
        type: "counterSignReject",
        label: "counterSignReject",
        tooltip: "counterSignRejectTip",
    },
    {
        type: "counterSignAbstain",
        label: "counterSignReject",
        tooltip: "counterSignRejectTip",
    },
];

/**
 * 按钮配置-原有按钮配置
 */
export class AvailableButtons extends PanelInput {

    selectedButtons: HTMLInputElement[] = [];

    constructor() {
        super();
        this.inputLabel = 'availableButtons';
        this.init();
    }

    init() {
        const container = document.querySelector('.easy-bpmn-designer-container') || undefined;
        const buttonConfig = document.createElement('div');
        buttonConfig.classList.add('button-config');
        for (let availableButton of availableButtons) {
            const label = document.createElement('label');
            label.classList.add('button-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'availableButtons';
            checkbox.value = availableButton.type;
            checkbox.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
            this.selectedButtons.push(checkbox);
            label.appendChild(checkbox);

            const span = document.createElement('span');
            span.innerText = t(availableButton.label);
            label.appendChild(span);

            tippy(label, {
                appendTo: container,
                content: t(availableButton.tooltip),
                theme: 'easy-bpmn-designer-tip',
                arrow: true,
            });
            buttonConfig.appendChild(label);
        }

        this.customElement = buttonConfig;
    }

    onChangeValue(_e: Event, element: BpmnElement, modeler?: Modeler) {
        const arr = [];
        for (let dom of this.selectedButtons) {
            if (dom.checked) {
                arr.push(dom.value);
            }
        }
        updateProperty('buttonConfig', JSON.stringify(arr), element, modeler);
    }

    onChange(element: BpmnElement) {
        const selectedButtons = JSON.parse(element.businessObject.buttonConfig || '[]') as string[];
        for (let dom of this.selectedButtons) {
            dom.checked = selectedButtons.includes(dom.value);
        }
    }
}