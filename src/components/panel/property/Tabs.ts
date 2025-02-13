import {AbstractPanel} from "../AbstractPanel.ts";
import {BasicPanel} from "./Basic.ts";


export class Tabs extends AbstractPanel {

    currentTab: string = 'basic';
    template = ``;

    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(new BasicPanel());
    }

}