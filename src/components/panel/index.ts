import { Switch } from './Switch.ts';
import { BpmnIcon } from './BpmnIcon.ts';
import { Property } from './Property.ts';
import { defineCustomElement } from "../../utils/domUtils.ts";
import { EasyBpmnDesignerOptions } from "../../types/easy-bpmn-designer.ts";
import { AbstractPanel } from "./AbstractPanel.ts";
import { PanelContent } from "./property/Content.ts";
import { TabGroup } from "./property/TabGroup.ts";
import { defaultPanelKeys } from "./DefaultPanelTabs.ts";
import { Modeler } from "bpmn-js";

defineCustomElement('easy-bpmn-designer-panel-switch', Switch);
defineCustomElement('easy-bpmn-designer-panel-bpmn-icon', BpmnIcon);
defineCustomElement('easy-bpmn-designer-panel-property', Property);
defineCustomElement('easy-bpmn-designer-panel-property-content', PanelContent);
defineCustomElement('easy-bpmn-designer-panel-property-group', TabGroup);

export const initPanelKeys = (modeler: Modeler,
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
        const property = document.createElement('easy-bpmn-designer-panel-property') as Property;
        property.classList.add('panel-content');
        property.onCreate(modeler, options);
        panelDom.push(property);
    } catch (e) {
        console.log('属性面板创建失败', e);
    }
}

export const initPanelContent = (modeler: Modeler,
                                 options: EasyBpmnDesignerOptions, property: Property) => {
    try {
        const panelTabs = defaultPanelKeys?.concat(options?.panelTabs || []) || [];
        for (let panelTab of panelTabs) {
            const panelContent = document.createElement('easy-bpmn-designer-panel-property-content') as PanelContent;
            panelContent.setProperty(property);
            panelContent.onCreate(modeler, options);
            panelContent.style.display = panelTab.key === property.activeKey ? 'block' : 'none';
            panelContent.setAttribute('id', panelTab.key);
            panelContent.initGroup(modeler, options, panelTab.group);
            property.content.push(panelContent);
        }
    } catch (e) {
        console.log('tab-content创建失败', e);
    }
}
