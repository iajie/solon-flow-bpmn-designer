import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { ASSIGNEE_TYPES } from "../../../../constants/assigneeType.ts";
import { t } from "i18next";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class AssigneeType extends PanelInput {
    radioGroup!: HTMLDivElement;

    constructor() {
        super();
        this.inputLabel = 'assigneeType';
        this.init();
    }

    init() {
        const radioGroup = document.createElement('div');
        radioGroup.classList.add('radio-group');
        
        // 添加单选按钮
        Object.entries(ASSIGNEE_TYPES).forEach(([value, label]) => {
            const label_el = document.createElement('label');
            label_el.classList.add('radio-item');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'assigneeType';
            radio.value = value;
            radio.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
            
            const span = document.createElement('span');
            span.innerText = t(label);
            
            label_el.appendChild(radio);
            label_el.appendChild(span);
            radioGroup.appendChild(label_el);
        });

        this.radioGroup = radioGroup;
        this.customElement = radioGroup;
    }

    onChangeValue(e: Event, element?: BpmnElement, modeler?: Modeler) {
        const value = (e.target as HTMLInputElement).value;
        // 清除之前的值
        updateProperty('assignee', '', element, modeler);
        updateProperty('candidateUsers', '', element, modeler);
        updateProperty('candidateGroups', '', element, modeler);
        // 更新类型
        updateProperty('assigneeType', value, element, modeler);
        
        // 触发类型改变事件
        const event = new CustomEvent('assigneeTypeChange', {
            detail: { type: value },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    onChange(element: BpmnElement) {
        if (!element?.businessObject) return;
        // 修改默认值为 user
        const value = element.businessObject.assigneeType || ASSIGNEE_TYPES.USER;
        
        // 触发一个类型改变事件，以便更新选择器的选项
        const event = new CustomEvent('assigneeTypeChange', {
            detail: { type: value },
            bubbles: true
        });
        this.dispatchEvent(event);
        
        // 设置单选按钮的选中状态
        const radios = this.radioGroup.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        radios.forEach(radio => {
            radio.checked = radio.value === value;
        });
    }
}
