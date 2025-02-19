import {AbstractPanel} from "../AbstractPanel.ts";
import { Property } from "../Property.ts";
import { t } from "i18next";
import { PanelInput } from "./PanelInput.ts";
import { defineCustomElement } from "../../../utils/domUtils.ts";
import { Name } from "./basic/Name.ts";
import { ID } from "./basic/ID.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { EasyBpmnDesignerOptions } from "../../../types/easy-bpmn-designer.ts";
import { FormPrimaryKey } from "./form/FormPrimaryKey.ts";
import { FormEditable } from "./form/FormEditable.ts";
import { BpmnElement } from "bpmn-js";
import { GatewayCondition } from "./gateway/Condition.ts";
import { MultiInstance } from "./multiInstance/MultiInstance.ts";
import { LoopCardinality } from "./multiInstance/LoopCardinality.ts";
import { CompletionCondition } from "./multiInstance/CompletionCondition.ts";
import { ConditionType } from "./sequenceFlow/ConditionType.ts";
import { ConditionExpression } from "./sequenceFlow/ConditionExpression.ts";
import { Timeout } from "./timeout/Timeout.ts";
import { TimeoutStrategy } from "./timeout/TimeoutStrategy.ts";
import { AssigneeEmpty } from "./advanced/AssigneeEmpty.ts";
import { ReturnSetting } from "./advanced/ReturnSetting.ts";
// 删除旧的导入
// import { Assignee } from "./assignee/Assignee.ts";
// import { CandidateUsers } from "./assignee/CandidateUsers.ts";
// import { CandidateGroups } from "./assignee/CandidateGroups.ts";
import { AvailableButtons } from "./buttons/AvailableButtons.ts";
import { AutoSkipOptions } from "./buttons/AutoSkipOptions.ts";
// 修正新的导入
import { AssigneeType } from "./assignee/AssigneeType.ts";
import { AssigneeSelector } from "./assignee/AssigneeSelector.ts";

defineCustomElement('easy-panel-id', ID);
defineCustomElement('easy-panel-name', Name);
defineCustomElement('easy-panel-form-primary-key', FormPrimaryKey);
defineCustomElement('easy-panel-allow-editing', FormEditable);
defineCustomElement('easy-panel-gateway-condition-expression', GatewayCondition);
defineCustomElement('easy-panel-multi-instance', MultiInstance);
defineCustomElement('easy-panel-loop-cardinality', LoopCardinality);
defineCustomElement('easy-panel-completion-condition', CompletionCondition);
defineCustomElement('easy-panel-condition-type', ConditionType);
defineCustomElement('easy-panel-condition-expression', ConditionExpression);
defineCustomElement('easy-panel-timeout', Timeout);
defineCustomElement('easy-panel-timeout-strategy', TimeoutStrategy);
defineCustomElement('easy-panel-assignee-empty', AssigneeEmpty);
defineCustomElement('easy-panel-return-setting', ReturnSetting);
// 删除旧的组件注册
// defineCustomElement('easy-panel-assignee', Assignee);
// defineCustomElement('easy-panel-candidate-users', CandidateUsers);
// defineCustomElement('easy-panel-candidate-groups', CandidateGroups);
// 添加新的组件注册
defineCustomElement('easy-panel-assignee-type', AssigneeType);
defineCustomElement('easy-panel-assignee-selector', AssigneeSelector);
defineCustomElement('easy-panel-available-buttons', AvailableButtons);
defineCustomElement('easy-panel-auto-skip-options', AutoSkipOptions);

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
        this.classList.add("tab-content");
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
            if (group.items && group.items.length) {
                // 以下为自定义拓展
                for (let item of group.items) {
                    const groupItem = document.createElement('div');
                    groupItem.classList.add("property-item");
                    const label = document.createElement('label');
                    label.innerText = t(item.label);
                    groupItem.appendChild(label);
                    if (item.html) {
                        groupItem.append(item.html);
                    }
                    if (item.type) {
                        const panelInput = document.createElement('panel-input') as PanelInput;
                        panelInput.type = item.type;
                        if (this.modeler && this.assigneeOptions) {
                            panelInput.onCreate(this.modeler, this.assigneeOptions);
                        }
                        groupItem.append(panelInput);
                    }
                    groupDom.appendChild(groupItem);
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