import {AbstractPanel} from "../AbstractPanel.ts";
import {BpmnElement} from "bpmn-js";
import {t} from "i18next";
import {defaultPanelKeys} from "../DefaultPanelTabs.ts";
import { EasyBpmnDesignerOptions } from "../../../types/easy-bpmn-designer.ts";

export class Tabs extends AbstractPanel {

    activeKey: string = 'basic';

    constructor() {
        super();
        this.template = `<div class="tab-item active first">${t('basic')}</div>`
    }

    getTabKey(tabs: EasyBpmnDesignerOptions['panelTabs'], element: BpmnElement) {
        return tabs?.filter(i => i.hideIn = () => element.type === 'bpmn:UserTask')
            .map(i => i.title);
    }

    onChange(element: BpmnElement) {
        if (this.innerHTML) {
            this.innerHTML = ``;
        }
        // 重置 activeKey 为 basic
        this.activeKey = 'basic';
        
        const panelTab = (this.getTabKey(defaultPanelKeys, element) || [])
            .concat(this.getTabKey(this.options?.panelTabs, element) || []);
        for (let i = 0; i < panelTab.length; i++) {
            const defaultPanelTab = panelTab[i];
            const dom = document.createElement('div');
            // 根据重置后的 activeKey 设置激活状态
            dom.classList.add('tab-item');
            // 如果是第一个就加外边距
            if (i == 0) {
                dom.classList.add('first');
            }
            if (defaultPanelTab === this.activeKey) {
                dom.classList.add('active');
            }
            dom.style.display = element.type === 'bpmn:UserTask' ? 'block' : 'none';
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

        // 触发 activeKey 更改事件
        const event = new CustomEvent('tabChange', {
            detail: { activeKey: this.activeKey }
        });
        this.dispatchEvent(event);
    }

}