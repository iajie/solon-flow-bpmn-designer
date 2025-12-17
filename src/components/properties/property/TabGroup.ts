import { AbstractPanel } from "../AbstractPanel.ts";

export class TabGroup extends AbstractPanel {

    content: AbstractPanel[] = [];

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("property-group");
    }
}