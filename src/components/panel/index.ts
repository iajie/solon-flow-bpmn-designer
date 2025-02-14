import { Switch } from './Switch.ts';
import { BpmnIcon } from './BpmnIcon.ts';
import { Tabs } from './property/Tabs.ts';
import { Property } from './Property.ts';
import {defineCustomElement} from "../../utils/domUtils.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { EasyBpmnDesignerOptions } from "../../types/easy-bpmn-designer.ts";
import {AbstractPanel} from "./AbstractPanel.ts";

defineCustomElement('easy-bpmn-designer-panel-switch', Switch);
defineCustomElement('easy-bpmn-designer-panel-bpmn-icon', BpmnIcon);
defineCustomElement('easy-bpmn-designer-panel-tabs', Tabs);
defineCustomElement('easy-bpmn-designer-panel-property', Property);

export const initPanelKeys = (modeler: BpmnModeler,
                              options: EasyBpmnDesignerOptions, panelDom: AbstractPanel[]) => {
    try {
        // 创建开关
        const panelSwitch = document.createElement('easy-bpmn-designer-panel-switch') as AbstractPanel;
        panelSwitch.classList.add('panel-toggle');
        panelSwitch.onCreate(modeler, options);
        panelDom.push(panelSwitch);
        // 创建图标
        const bpmnIcon = document.createElement('easy-bpmn-designer-panel-bpmn-icon') as AbstractPanel;
        bpmnIcon.classList.add('panel-header');
        bpmnIcon.onCreate(modeler, options);
        panelDom.push(bpmnIcon);
        // 创建Tabs
        const tabs = document.createElement('easy-bpmn-designer-panel-tabs') as Tabs;
        tabs.classList.add('panel-tabs');
        tabs.onCreate(modeler, options);
        panelDom.push(tabs);
        // 创建Tabs
        const property = document.createElement('easy-bpmn-designer-panel-property') as Property;
        property.classList.add('panel-content');
        property.onCreate(modeler, options);
        panelDom.push(property);
        tabs.addEventListener('click', () => {
            property.onActiveKeyChange(tabs.activeKey);
        });
    } catch (e) {
        console.log('属性面板创建失败', e);
    }
}
