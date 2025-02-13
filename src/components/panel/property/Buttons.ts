import {Tabs} from "./Tabs.ts";
import {BpmnElement} from "bpmn-js";
import {t} from "i18next";

export class ButtonsPanel extends Tabs {

    constructor() {
        super();
        this.registerClickListener();
    }

    onClick() {
        this.currentTab = "buttons";
    }

    onChange(element: BpmnElement) {
        if (element.type === 'bpmn:UserTask') {
            this.template = `<div class="tab-item">${t('buttons')}</div>`;
        }
    }
}