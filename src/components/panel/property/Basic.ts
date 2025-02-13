import {Tabs} from "./Tabs.ts";
import {t} from "i18next";

export class BasicPanel extends Tabs {

    constructor() {
        super();
        this.template = `<div class="tab-item">${t('basic')}</div>`;
        this.registerClickListener();
    }

    onClick() {
        this.currentTab = `basic`;
    }
}