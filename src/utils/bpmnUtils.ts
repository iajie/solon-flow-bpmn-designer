// @ts-ignore
import {EasyBpmnDesignerOptions} from "../core/EasyBpmnDesigner.ts";
import {
    Create,
    ElementFactory,
} from "bpmn-js/lib/features/palette/PaletteProvider";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {BpmnElement, BpmnFactory, Modeling} from "bpmn-js";

export const initModelerStr = (key?: string, name?: string) => {
    const timestamp = Date.now();
    const newId: string = `Process_${timestamp}`;
    const newName: string = `业务流程_${timestamp}`;
    return bpmnStr(key ? key : newId, name ? name : newName);
};

const bpmnStr = (key: string, name: string,) => {

    return `<?xml version="1.0" encoding="UTF-8"?>
<definitions id="definitions" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
    typeLanguage="http://www.w3.org/2001/XMLSchema"
    expressionLanguage="http://www.w3.org/1999/XPath">
<process id="${key}" name="${name}" isExecutable="true">
    <startEvent id="StartEvent_1y45yut" name="开始">
    </startEvent>
</process>
<bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="BpmnPlane">
        <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
            <dc:Bounds x="192" y="250" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="199" y="293" width="23" height="14" />
            </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>`;
};

export const createAction = (
    elementFactory: ElementFactory,
    create: Create,
    type: string,
    group: string,
    className: string,
    title: string,
    options?: Object
) => {
    const createListener = (event: any) => {
        const shape = elementFactory.createShape(
            Object.assign({type: type}, options)
        );

        if (options) {
            !shape.businessObject.di && (shape.businessObject.di = {});
            shape.businessObject.di.isExpanded = (
                options as { [key: string]: any }
            ).isExpanded;
        }

        create.start(event, shape);
    };

    return {
        group: group,
        className: className,
        title: title,
        action: {
            dragstart: createListener,
            click: createListener,
        },
    };
};

export const downloadFile = (content: string, filename: string, type = "text/xml") => {
    const blob = new Blob([content], {type});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};

export const updateProperty = (key: string, value: any, element?: BpmnElement, modeler?: BpmnModeler) => {
    if (!element || !modeler) return;
    const modeling = modeler.get("modeling") as Modeling;
    try {
        const updateObj: Record<string, any> = {};
        updateObj[key] = value;
        // 使用原始元素进行更新
        modeling.updateProperties(element, updateObj);
        // 更新本地状态
    } catch (error) {
        console.error("Failed to update property:", error);
    }
};

export const updateMultiInstance = (type: string, element?: BpmnElement, modeler?: BpmnModeler) => {
    if (!element || !modeler) return;
    const bpmnFactory = modeler.get("bpmnFactory") as BpmnFactory;
    const modeling = modeler.get("modeling") as Modeling;
    try {
        if (type) {
            // 创建多实例特性
            const loopCharacteristics = bpmnFactory.create(
                "bpmn:MultiInstanceLoopCharacteristics",
                {isSequential: type === "sequential"}
            );
            modeling.updateProperties(element, {
                loopCharacteristics: loopCharacteristics,
            });
        } else {
            // 移除多实例特性
            modeling.updateProperties(element, {
                loopCharacteristics: null,
            });
        }
    } catch (error) {
        console.error("Failed to update multi-instance:", error);
    }
};

/**
 * 添加更新条件表达式的方法
 * @param type
 * @param expression
 * @param element
 * @param modeler
 */
export const updateCondition = (type: string, expression: string = "", element?: BpmnElement, modeler?: BpmnModeler) => {
    if (!element || !modeler) return;
    const bpmnFactory = modeler.get("bpmnFactory") as BpmnFactory;
    const modeling = modeler.get("modeling") as Modeling;
    try {
        if (type === "expression" && expression) {
            // 创建条件表达式
            const conditionExpression = bpmnFactory.create("bpmn:FormalExpression", {
                body: expression,
            });
            modeling.updateProperties(element, {
                conditionExpression: conditionExpression,
            });
        } else {
            // 移除条件表达式
            modeling.updateProperties(element, {
                conditionExpression: null,
            });
        }
    } catch (error) {
        console.error("Failed to update condition:", error);
    }
};

/**
 * 判断元素节点类型
 * @param type
 * @param arrays
 */
export const isType = (type: string, arrays: string | string[]) => {
    if (Array.isArray(arrays)) {
        return arrays.includes(type);
    }
    return type === arrays;
}
