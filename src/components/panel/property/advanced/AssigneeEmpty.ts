import { AdvancedGroup } from "./AdvancedGroup.ts";
import { t } from "i18next";
import { BpmnElement } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import Modeler from "bpmn-js/lib/Modeler";

/**
 * 高级设置-处理人为空时的处理方式
 */
export class AssigneeEmpty extends AdvancedGroup {

    constructor() {
        super();
        this.inputLabel = 'assigneeEmpty';
        this.option = [
            { label: t('autoPass'), value: 'autoApprove' },
            { label: t('autoReject'), value: 'autoReject' },
        ];
        this.key = 'emptyHandlerType';
        this.defaultValue = 'autoApprove';  // 确保默认值为autoApprove（自动通过）
        this.init();
    }

}