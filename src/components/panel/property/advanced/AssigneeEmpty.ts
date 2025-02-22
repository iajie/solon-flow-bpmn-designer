import { AdvancedGroup } from "./AdvancedGroup.ts";

/**
 * 高级设置-处理人为空时的处理方式
 */
export class AssigneeEmpty extends AdvancedGroup {

    constructor() {
        super();
        this.inputLabel = 'assigneeEmpty';
        this.option = [
            { label: 'autoPass', value: 'autoApprove' },
            { label: 'autoReject', value: 'autoReject' },
        ];
        this.key = 'emptyHandlerType';
        this.defaultValue = 'autoApprove';  // 确保默认值为autoApprove（自动通过）
        this.init();
    }

}