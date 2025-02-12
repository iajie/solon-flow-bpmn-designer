import {DesignerEventListener} from "../core/EasyBpmnDesigner.ts";
import bpmnModeler from "bpmn-js/lib/Modeler";
import {EasyBpmnDesignerOptions} from "../types/easy-bpmn-designer.ts";
import type { BpmnElement } from "../types/bpmn.d.ts";


interface EasyBpmnPanelOptions {
    originalElement?: any;
}

const defaultOptions: EasyBpmnPanelOptions = {
    originalElement: null,

};

export class Panel extends HTMLElement implements DesignerEventListener {

    modeler: bpmnModeler | undefined;
    easyBpmnDesignerOptions: EasyBpmnDesignerOptions | undefined;
    options: EasyBpmnPanelOptions;

    selectedElement: BpmnElement | null = null;

    elementProperties: Record<string, any> = {};

    selectedButtons: string[] = [];
    selectedAutoSkipTypes: string[] = [];

    processId: string = '';
    processName: string = '';
    constructor() {
        super();
        this.options = { ...defaultOptions };
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("easy-bpmn-designer-container-panel");
        // 小按钮-开关
        const panelToggle = document.createElement('div');
        panelToggle.classList.add('panel-toggle');
        panelToggle.innerHTML = `<svg t="1739345500641" class="toggle-icon" aria-hidden="true" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5172" width="200" height="200"><path d="M544 522.666667c0-8.533333-4.266667-17.066667-10.666667-23.466667L192 189.866667c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733334 285.866667L149.333333 808.533333c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466667 10.666667 8.533333 0 14.933333-2.133333 21.333333-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666z" fill="#666666" p-id="5173"></path><path d="M864 499.2l-341.333333-309.333333c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733333 285.866667-315.733333 285.866666c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466666 10.666667 8.533333 0 14.933333-2.133333 21.333334-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666 0-8.533333-4.266667-17.066667-10.666667-23.466667z" fill="#666666" p-id="5174"></path></svg>`;
        this.appendChild(panelToggle);
        panelToggle.addEventListener('click', () => this.togglePanel(this));
        // 图标


    }

    togglePanel(panelDom: HTMLElement) {
        const toolbar = document.querySelector('.easy-bpmn-designer-container-toolbar');
        if (panelDom.classList.contains('panel-collapsed')) {
            panelDom.classList.remove('panel-collapsed');
            toolbar?.classList.remove('toolbar-width')
        } else {
            panelDom.classList.add('panel-collapsed');
            toolbar?.classList.add('toolbar-width');
        }
    }

    onCreate(modeler: bpmnModeler, options: EasyBpmnDesignerOptions): void {
        this.modeler = modeler;
        this.easyBpmnDesignerOptions = options;
        // 先移除旧的监听器
        modeler.off("selection.changed", this.handleSelectionChange);
        // 添加新的监听器
        modeler.on("selection.changed", this.handleSelectionChange);
    }

    handleSelectionChange(e: { newSelection: BpmnElement[] }) {
        let element = e.newSelection[0] || null;
        // 保存原始元素引用
        if (element) {
            this.options.originalElement = element;
            this.selectedElement = element;
        }

        if (this.selectedElement) {
            const businessObject = element.businessObject;
            const loopCharacteristics = businessObject.loopCharacteristics;
            this.elementProperties = {
                id: businessObject.id || "",
                name: businessObject.name || "",
                type: element.type.replace("bpmn:", ""),
                assignee: businessObject.assignee || "", // 添加处理人属性
                formKey: businessObject.formKey || "",
                candidateUsers: businessObject.candidateUsers || "",
                candidateGroups: businessObject.candidateGroups || "",
                // 多实例属性
                multiInstanceType: loopCharacteristics
                    ? loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics"
                        ? loopCharacteristics.isSequential
                            ? "sequential"
                            : "parallel"
                        : ""
                    : "",
                loopCardinality: loopCharacteristics?.loopCardinality?.body || "",
                completionCondition: loopCharacteristics?.completionCondition?.body || "",
                buttonConfig: businessObject.buttonConfig || "[]",
                conditionExpression: businessObject.conditionExpression?.body || "",
                // 添加流程条件类型
                conditionType: businessObject.conditionExpression ? "expression" : "",
                autoSkipType: businessObject.autoSkipType || "",
                emptyHandlerType: businessObject.emptyHandlerType || "autoApprove", // 设置默认值为自动通过
                returnType: businessObject.returnType || "restart", // 设置默认值为重新审批
                formEditable: businessObject.formEditable === undefined ? false : businessObject.formEditable, // 默认为true
                dueDate: businessObject.dueDate || "", // timeout改为dueDate
                timeoutStrategy: businessObject.timeoutStrategy || "",
            }

            this.selectedButtons = JSON.parse(JSON.stringify(this.elementProperties.buttonConfig || '[]'));
            this.selectedAutoSkipTypes = businessObject.autoSkipType ? businessObject.autoSkipType.split(",") : [];

        } else {
            this.elementProperties = {};
            this.getProcessInfo();
        }

    }

    getProcessInfo(){
        if (!this.modeler) return;
        const elementRegistry = this.modeler?.get("elementRegistry") as any;
        const process = elementRegistry.find((el: any) => el.type === "bpmn:Process");

        if (process) {
            this.processId = process.id || "";
            this.processName = process.businessObject.name || "";
        }
    }

}