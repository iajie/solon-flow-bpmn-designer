import { PanelInput } from "../PanelInput.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import { BpmnElement } from "bpmn-js";

const autoSkipOptions = [
    { value: "starter", label: "审批人为发起人" },
    { value: "lastHandler", label: "审批人与上一审批节点处理人相同" },
    { value: "approved", label: "审批人审批过" },
];

export class AutoSkipOptions extends PanelInput {

    constructor() {
        super();
        this.inputLabel = 'autoSkipOptions';
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        console.log(autoSkipOptions);
        updateProperty('autoSkipType', (e.target as HTMLInputElement).value || '', element, modeler);
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        const autoSkipType = element.businessObject.autoSkipType;
        this.inputElement && (this.inputElement.value = autoSkipType ? autoSkipType.split(',') : []);
    }
}