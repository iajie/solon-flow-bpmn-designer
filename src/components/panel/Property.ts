import {AbstractPanel} from "./AbstractPanel.ts";

export class Property extends AbstractPanel {

    constructor() {
        super();
    }

    onActiveKeyChange(activeKey: string) {
        if (this.innerHTML) {
            this.innerHTML = ``;
        }

        console.log('active key', activeKey);
    }

}