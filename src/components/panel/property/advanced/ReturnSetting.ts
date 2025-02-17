import { AdvancedGroup } from "./AdvancedGroup.ts";
import { t } from "i18next";

export class ReturnSetting extends AdvancedGroup {

    constructor() {
        super();
        this.inputLabel = 'returnSetting';
        this.key = 'returnType';
        this.defaultValue = 'restart';
        this.option = [
            { label: t('reApprove'), value: 'restart' },
            { label: t('currentNode'), value: 'continue' },
        ];

        this.init();
    }

}