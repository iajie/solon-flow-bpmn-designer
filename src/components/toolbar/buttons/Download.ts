import {AbstractToolBarMenuButton} from "../../AbstractToolBarMenuButton.ts";
import {downloadFile} from "../../../utils/bpmnUtils.ts";

export class Download extends AbstractToolBarMenuButton {

    constructor() {
        super();
        this.template = `<div>
            <svg t="1739257013336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5610" width="200" height="200"><path d="M128 704v192h768v-192h64v256H64v-256h64z m416-576v518.4l236.8-230.4 51.2 44.8-281.6 268.8-38.4 38.4-307.2-307.2 44.8-44.8 230.4 230.4V128h64z" p-id="5611"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    onClick() {
        this.modeler?.saveXML({ format: true }).then(({xml}) => {
            if (xml) {
                downloadFile(xml, 'easy-bpmn-designer.xml')
            }
        });
    }
}