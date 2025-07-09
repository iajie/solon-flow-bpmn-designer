import {AbstractPanel} from "../AbstractPanel.ts";
import { Property } from "../Property.ts";
import { t } from "i18next";
import { PanelInput } from "./PanelInput.ts";
import { defineCustomElement } from "../../../utils/domUtils.ts";
import { Name } from "./basic/Name.ts";
import { ID } from "./basic/ID.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { EasyBpmnDesignerOptions } from "../../../types/easy-bpmn-designer.ts";
import { BpmnElement } from "bpmn-js";
import { ConditionType } from "./sequenceFlow/ConditionType.ts";
import { ConditionExpression } from "./sequenceFlow/ConditionExpression.ts";
import {Driver} from "./china/Name.ts";
import {Meta} from "./china/Meta.ts";

defineCustomElement('easy-panel-id', ID);
defineCustomElement('easy-panel-name', Name);
defineCustomElement('easy-panel-driver', Driver);
defineCustomElement('easy-panel-meta', Meta);
defineCustomElement('easy-panel-condition-type', ConditionType);
defineCustomElement('easy-panel-condition-expression', ConditionExpression);

export class PanelContent extends AbstractPanel {

    property: Property | undefined;

    group: HTMLDivElement[] = [];

    constructor() {
        super();
    }

    setProperty(property: Property): void {
        this.property = property;
        this.property.onActiveKeyChange = this.onActiveKeyChange.bind(this);
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        for (let dom of this.group) {
            this.appendChild(dom);
        }
    }

    onChange(element: BpmnElement) {
        for (let htmlDivElement of this.group) {
            const show = htmlDivElement.getAttribute('show');
            if (show) {
                htmlDivElement.style.display = !element.type.includes(show) ? "none" : "block";
            }
        }
    }

    initGroup(modeler: BpmnModeler, options: EasyBpmnDesignerOptions, panelGroup: any) {
        for (let group of panelGroup) {
            const groupDom = document.createElement('div');
            groupDom.style.display = group.title == 'basic' ? "block" : "none";
            groupDom.classList.add("property-group");
            if (group.show) {
                groupDom.setAttribute('show', group.show);
            }
            const title = document.createElement('div');
            title.innerText = t(group.title);
            title.classList.add("group-title");
            groupDom.appendChild(title);

            // 默认提供的
            if (group.easy) {
                for (let easyKey of group.easy) {
                    const input = document.createElement(`easy-panel-${easyKey}`) as PanelInput;
                    input.onCreate(modeler, options);
                    groupDom.appendChild(input);
                }
            }
            this.group.push(groupDom);
        }
        this.connectedCallback();
    }

    /**
     * 控制tabs显隐
     * @param activeKey
     */
    onActiveKeyChange(activeKey: string) {
        const parents = this.parentNode?.children;
        if (parents) {
            for (let dom of parents) {
                // @ts-ignore
                dom.style.display = dom.id === activeKey ? 'block' : 'none';
            }
        }
    }

}
