import {AbstractToolBar} from "./AbstractToolBar.ts";

export class Divider extends AbstractToolBar {
    constructor() {
        super();
        this.template = `<div no-hover style="width: 1px;display: flex; font-weight: bold"><div class="easy-bpmn-designer-menu-divider" /></div>`;
    }
}
