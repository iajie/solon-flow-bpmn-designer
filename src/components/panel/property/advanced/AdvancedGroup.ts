import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { t } from "i18next";
import tippy from "tippy.js";

export class AdvancedGroup extends PanelInput {

    option: { label: string; value: string; tip?: string }[] = [];
    key!: 'returnType' | 'emptyHandlerType';
    value!: string;
    defaultValue!: string;
    constructor() {
        super();
    }

    init() {
        const radioGroup = document.createElement('div');
        radioGroup.classList.add('input-wrapper');
        radioGroup.classList.add('radio-group');
        if (this.option && this.option.length) {
            for (let item of this.option) {
                const label = document.createElement('label');
                label.classList.add('radio-item');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = this.key;
                radio.value = item.value;
                radio.onchange = (e) => this.onChangeValue(e, this.element, this.modeler)
                label.appendChild(radio);
                const span = document.createElement('span');
                span.innerText = t(item.label);
                label.appendChild(span);
                if (item.tip) {
                    const tip = document.createElement('span');
                    tip.classList.add('help-icon');
                    tip.innerText = '?';
                    tippy(tip, {
                        appendTo: document.querySelector('.easy-bpmn-designer-container')!,
                        content: t(item.tip),
                        theme: 'easy-bpmn-designer-tip',
                        arrow: true,
                    });
                    label.appendChild(tip);
                }

                radioGroup.appendChild(label);
            }
        }
        this.customElement = radioGroup;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty(this.key, (e.target as HTMLInputElement).value, element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        if (!element?.businessObject) {
            return;
        }
        // 获取实际值或默认值
        const value = element.businessObject[this.key] || this.defaultValue;
        
        // 找到对应的单选按钮并设置选中状态
        const radioGroup = this.customElement as HTMLDivElement;
        if (radioGroup) {
            const radios = radioGroup.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            radios.forEach(radio => {
                radio.checked = radio.value === value;
            });
        }
    }
}