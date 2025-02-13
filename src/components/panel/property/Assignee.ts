import {Tabs} from "./Tabs.ts";
import {BpmnElement} from "bpmn-js";
import {t} from "i18next";

export class AssigneePanel extends Tabs {

    constructor() {
        super();
        this.registerClickListener();
    }

    onClick() {
        this.currentTab = "assignee";
    }

    onChange(element: BpmnElement) {
        if (element.type === 'bpmn:UserTask') {
            this.template = `<div class="tab-item">${t('assignee')}</div>`;
        }
    }
}