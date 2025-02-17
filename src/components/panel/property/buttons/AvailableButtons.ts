import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";
import tippy from "tippy.js";

const availableButtons = [
    {
        type: "approve",
        label: "同意",
        tooltip: "审批通过，流程继续",
    },
    {
        type: "reject",
        label: "拒绝",
        tooltip: "审批拒绝，通过流程变量/流程线继续流转",
    },
    {
        type: "delegate",
        label: "委派",
        tooltip: "将任务委派给其他人处理，处理后会自动回到委派人",
    },
    {
        type: "transfer",
        label: "转办",
        tooltip: "将任务转交给其他人处理，处理后流程继续",
    },
    {
        type: "returnToNode",
        label: "退回到指定节点",
        tooltip: "将任务退回到已经处理过的任意节点",
    },
    {
        type: "returnToStarter",
        label: "退回到发起人",
        tooltip: "将任务退回到流程发起人",
    },
    {
        type: "terminate",
        label: "驳回结束",
        tooltip: "驳回任务，流程直接结束",
    },
    {
        type: "addSign",
        label: "加签",
        tooltip: "添加临时审批人，临时审批人处理后回到当前节点",
    },
    {
        type: "counterSignApprove",
        label: "同意(会签)",
        tooltip: "会签任务同意选项",
    },
    {
        type: "counterSignReject",
        label: "拒绝(会签)",
        tooltip: "会签任务拒绝选项",
    },
    {
        type: "counterSignAbstain",
        label: "弃权(会签)",
        tooltip: "会签任务弃权选项",
    },
];

/**
 * 按钮配置-原有按钮配置
 */
export class AvailableButtons extends PanelInput {

    selectedButtons: string[] = [];

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
            label.appendChild(checkbox);

            const span = document.createElement('span');
            span.innerText = t(availableButton.label);
            label.appendChild(span);

            tippy(label, {
                appendTo: container,
                content: availableButton.tooltip,
                theme: 'easy-bpmn-designer-tip',
                arrow: true,
            });
            buttonConfig.appendChild(label);
        }

        this.customElement = buttonConfig;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('buttonConfig', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.selectedButtons = JSON.parse(element.businessObject.buttonConfig || '[]');
    }
}