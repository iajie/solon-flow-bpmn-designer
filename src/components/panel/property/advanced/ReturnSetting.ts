import { AdvancedGroup } from "./AdvancedGroup.ts";
import { t } from "i18next";
import { BpmnElement } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import Modeler from "bpmn-js/lib/Modeler";

export class ReturnSetting extends AdvancedGroup {

    constructor() {
        super();
        this.inputLabel = 'returnSetting';
        this.key = 'returnType';
        this.defaultValue = 'restart';  // 确保默认值为restart（重新审批）
        this.option = [
            { label: t('reApprove'), value: 'restart' },
            { label: t('currentNode'), value: 'continue' },
        ];

        this.init();
    }

}