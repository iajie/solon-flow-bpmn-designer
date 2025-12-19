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
        this.modeler?.saveXML({ format: true }).then(({ xml }) => {
            if (xml) {
                downloadFile(xml, 'easy-bpmn-designer.xml')
            }
        });
    }
}
