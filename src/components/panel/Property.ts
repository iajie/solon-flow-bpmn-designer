import {AbstractPanel} from "./AbstractPanel.ts";
import {BpmnFactory, Modeling} from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { EasyBpmnDesignerOptions } from "../../types/easy-bpmn-designer.ts";
import { initPanelContent } from "./index.ts";

export class Property extends AbstractPanel {

    content: AbstractPanel[] = [];

    activeKey: string = 'basic';

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        for (let dom of this.content) {
            this.appendChild(dom);
        }
    }

    onActiveKeyChange(activeKey: string) {
        this.activeKey = activeKey;
    }

    onCreate(modeler: Modeler, options: EasyBpmnDesignerOptions) {
        super.onCreate(modeler, options);
        initPanelContent(modeler, options, this);
    }

    bpmnFactory() {
        return this.modeler?.get('bpmnFactory') as BpmnFactory;
    }

    modeling() {
        return this.modeler?.get('modeling') as Modeling;
    }

    updateProperty(key: string, value: any){
        try {
            const updateObj: Record<string, any> = {};
            updateObj[key] = value;
            // 使用原始元素进行更新
            this.modeling().updateProperties(this.element, updateObj);
        } catch (error) {
            console.error("Failed to update property:", error);
        }
    }

}