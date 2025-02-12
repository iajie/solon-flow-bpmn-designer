import {AbstractToolBarMenuButton} from "../AbstractToolBarMenuButton.ts";

export class Divider extends AbstractToolBarMenuButton {
    constructor() {
        super();
        this.template = `<div no-hover style="width: 1px;display: flex; font-weight: bold"><div class="easy-bpmn-designer-menu-divider" /></div>`;
    }
}
