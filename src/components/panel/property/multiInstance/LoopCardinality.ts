import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

export class LoopCardinality extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'loopCardinality';
        this.initTip();
    }

    initTip() {
        const panel = document.createElement('div');
        panel.classList.add('help-dialog-content');
        panel.innerHTML = `<h4>循环基数说明</h4>
          <div class="help-section">
            <h5>支持的变量类型：</h5>
            <ul>
              <li>数字：直接输入数字，如：3</li>
              <li>表达式：使用 \${} 包裹，如：\${nrOfInstances}</li>
              <li>集合：使用集合大小，如：\${userList.size()}</li>
            </ul>
          </div>
          <div class="help-section">
            <h5>常用示例：</h5>
            <ul>
              <li>\${nrOfInstances} - 实例总数</li>
              <li>\${userList.size()} - 用户列表大小</li>
              <li>\${deptUserCount} - 部门用户数</li>
            </ul>
          </div>`;
        this.inputLabelTip = panel;
    }

    onChange(element: BpmnElement) {
        const loopCharacteristics = element.businessObject.loopCharacteristics;
        this.onShow(loopCharacteristics ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics" : false)
        this.inputElement && (this.inputElement.value = loopCharacteristics?.loopCardinality?.body || "");
    }

    updateElement(element: BpmnElement) {
        const loopCharacteristics = element.businessObject.loopCharacteristics;
        this.onShow(loopCharacteristics ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics" : false);
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('loopCardinality', (e.target as HTMLInputElement).value || '', element, modeler);
    }

}