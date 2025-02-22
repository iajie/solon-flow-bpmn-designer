import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

export class CompletionCondition extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'completionCondition';
        this.initTip();
    }

    initTip() {
        const panel = document.createElement('div');
        panel.classList.add('help-dialog-content');
        panel.innerHTML = `<h4>完成条件说明</h4>
          <div class="help-section">
            <h5>内置变量：</h5>
            <ul>
              <li>nrOfInstances - 实例总数</li>
              <li>nrOfActiveInstances - 当前活动的实例数</li>
              <li>nrOfCompletedInstances - 已完成的实例数</li>
              <li>loopCounter - 当前实例的索引</li>
            </ul>
          </div>
          <div class="help-section">
            <h5>常用示例：</h5>
            <ul>
              <li>\${nrOfCompletedInstances >= 3} - 完成3个即可</li>
              <li>
                \${nrOfCompletedInstances/nrOfInstances >= 0.6} -
                完成60%即可
              </li>
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
        updateProperty('completionCondition', (e.target as HTMLInputElement).value || '', element, modeler);
    }

}