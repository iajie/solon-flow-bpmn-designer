import {EasyBpmnDesignerOptions} from "../../types/easy-bpmn-designer.ts";
import { DesignerEventListener, SolonFlowBpmnDesigner } from "../../core/EasyBpmnDesigner.ts";
import {BpmnElement, Modeler} from "bpmn-js";

export class AbstractPanel extends HTMLElement implements DesignerEventListener {

    template: string = '';
    modeler?: Modeler;
    options?: EasyBpmnDesignerOptions;
    originalElement?: BpmnElement;
    element?: BpmnElement & any;

    protected constructor() {
        super();
    }

    protected registerClickListener() {
        this.addEventListener("click", () => {
            this.onClick();
        })
    }

    connectedCallback() {
        this.innerHTML = this.template;
    }

    onClick() {

    }

    // @ts-ignore
    onChange(element: BpmnElement) {

    }

    // @ts-ignore
    updateElement(element: BpmnElement, oldProperties: any, properties: any) {}

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner): void {
        this.modeler = modeler;
        this.options = designer.options;
        if (!this.element) {
            const canvas = modeler?.get("canvas");
            this.element = canvas?.getRootElement();
            this.onChange(this.element);
        }
        // 先移除旧的监听器
        modeler.off("selection.changed", (e: any) => this.handleSelectionChange(e, modeler));
        // 添加新的监听器
        modeler.on("selection.changed", (e: any) => this.handleSelectionChange(e, modeler));
        // 先移除旧的监听器
        modeler.off("commandStack.element.updateProperties.executed", (e: any) => this.elementChanged(e));
        // 添加新的监听器
        modeler.on("commandStack.element.updateProperties.executed", (e: any) => this.elementChanged(e));
    }

    /**
     * 修改节点
     * @param e
     */
    elementChanged(e: any) {
        this.updateElement(e.context.element, e.context.oldProperties, e.context.properties);
    }

    handleSelectionChange(e: { newSelection: BpmnElement[] }, modeler: Modeler) {
        let element = e.newSelection[0] || null;
        // 保存原始元素引用
        if (element) {
            this.originalElement = element;
            this.element = element;
        } else {
            const elementRegistry = modeler?.get("elementRegistry") as any;
            this.element = elementRegistry.find((el: any) => el.type === "bpmn:Process");
        }
        this.onChange(this.element);
    }

}
