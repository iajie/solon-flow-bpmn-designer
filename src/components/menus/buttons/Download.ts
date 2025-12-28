import { AbstractToolBar } from "../AbstractToolBar.ts";
import { downloadFile } from "../../../utils/bpmnUtils.ts";
import { download } from "../icons.ts";

export class Download extends AbstractToolBar {

    constructor() {
        super();
        this.template = `<div>${download}</div>`;
        this.registerClickListener();
    }

    onClick() {
        const yaml = this.designer?.getValue();
        yaml && downloadFile(yaml, `solon-flow-bpmn-designer-${new Date().getTime()}.yaml`);
    }
}
