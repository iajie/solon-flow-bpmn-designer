import {AbstractPanel} from "../AbstractPanel.ts";
import {BpmnElement} from "bpmn-js";
import {t} from "i18next";
import {defaultPanelKeys} from "../DefaultPanelTabs.ts";
import { EasyBpmnDesignerOptions } from "../../../types/easy-bpmn-designer.ts";

export class Tabs extends AbstractPanel {

    activeKey: string = 'basic';

    constructor() {
        super();
        this.template = `<div class="tab-item active">${t('basic')}</div>`
    }

    getTabKey(tabs: EasyBpmnDesignerOptions['panelTabs'], element: BpmnElement) {
        return tabs?.filter(i => i.hideIn = () => element.type === 'bpmn:UserTask')
            .map(i => i.title);
    }

    onChange(element: BpmnElement) {
        if (this.innerHTML) {
            this.innerHTML = ``;
        }
        const panelTab = (this.getTabKey(defaultPanelKeys, element) || [])
            .concat(this.getTabKey(this.options?.panelTabs, element) || []);
        for (let defaultPanelTab of panelTab) {
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