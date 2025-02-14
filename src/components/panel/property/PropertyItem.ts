import {BpmnElement, BpmnFactory, Modeling} from "bpmn-js";
import BpmnModeler from "bpmn-js/lib/Modeler";

export abstract class PropertyItem extends HTMLElement {

    element: BpmnElement;
    modeler: BpmnModeler;

    protected constructor(element: BpmnElement, modeler: BpmnModeler) {
        super();
        this.element = element;
        this.modeler = modeler;
        this.classList.add('property-item');

    }

    bpmnFactory() {
        return this.modeler.get('bpmnFactory') as BpmnFactory;
    }

    modeling() {
        return this.modeler.get('modeling') as Modeling;
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

    updateMultiInstance(type: string){
        try {
            if (type) {
                // 创建多实例特性
                const loopCharacteristics = this.bpmnFactory().create(
                    "bpmn:MultiInstanceLoopCharacteristics", {isSequential: type === "sequential"}
                );

                this.modeling().updateProperties(this.element, {
                    loopCharacteristics: loopCharacteristics,
                });
            } else {
                // 移除多实例特性
                this.modeling().updateProperties(this.element, {
                    loopCharacteristics: null,
                });
            }
        } catch (error) {
            console.error("Failed to update multi-instance:", error);
        }
    }

    updateCondition = (type: string, expression: string = "") => {
        try {
            if (type === "expression" && expression) {
                // 创建条件表达式
                const conditionExpression = this.bpmnFactory().create("bpmn:FormalExpression", {
                    body: expression,
                });
                this.modeling().updateProperties(this.element, {
                    conditionExpression: conditionExpression,
                });
            } else {
                // 移除条件表达式
                this.modeling().updateProperties(this.element, {
                    conditionExpression: null,
                });
            }
        } catch (error) {
            console.error("Failed to update condition:", error);
        }
    }
}