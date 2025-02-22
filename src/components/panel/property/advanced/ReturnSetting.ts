import { AdvancedGroup } from "./AdvancedGroup.ts";

export class ReturnSetting extends AdvancedGroup {

    constructor() {
        super();
        this.inputLabel = 'returnSetting';
        this.key = 'returnType';
        this.defaultValue = 'restart';  // 确保默认值为restart（重新审批）
        this.option = [
            { label: 'reApprove', value: 'restart' },
            { label: 'currentNode', value: 'continue', tip: '若流程为A->B->C,C退回至A，则C->A->C' },
        ];

        this.init();
    }

}