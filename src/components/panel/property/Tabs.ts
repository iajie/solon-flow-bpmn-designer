import {AbstractPanel} from "../AbstractPanel.ts";
import {BpmnElement} from "bpmn-js";
import {t} from "i18next";

const defaultPanelTabs = ['basic', 'assignee', 'buttons'];

export class Tabs extends AbstractPanel {

    activeKey: string = 'basic';

    constructor() {
        super();
        this.template = `<div class="tab-item active">${t('basic')}</div>`
    }

    onChange(element: BpmnElement) {
        if (this.innerHTML) {
            this.innerHTML = ``;
        }
        for (let defaultPanelTab of defaultPanelTabs.concat(this.options?.panelTabs || [])) {
            const dom = document.createElement('div');
            if (defaultPanelTab === 'basic') {
                dom.classList.add('active');
            } else {
                dom.style.display = element.type === 'bpmn:UserTask' ? 'block' : 'none';
            }
            dom.classList.add('tab-item');
            dom.innerText = t(defaultPanelTab);
            dom.addEventListener('click', () => {
                for (let child of this.children) {
                    child.classList.remove('active');
                }
                dom.classList.add('active');
                this.activeKey = defaultPanelTab;
            });
            this.appendChild(dom);
        }
    }
}