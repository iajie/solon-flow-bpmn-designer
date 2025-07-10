// @ts-ignore
import {EasyBpmnDesignerOptions} from "../core/EasyBpmnDesigner.ts";
import {
    Create,
    ElementFactory,
} from "bpmn-js/lib/features/palette/PaletteProvider";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {BpmnElement, BpmnFactory, Modeling} from "bpmn-js";
import {SolonFlowChina, SolonFlowLink, SolonFlowNode} from "../types/easy-bpmn-designer.ts";
type Element = import("bpmn-js/lib/model/Types").Element;
export const initModelerStr = (key?: string, name?: string) => {
    const timestamp = Date.now();
    const newId: string = `Chain_${timestamp}`;
    const newName: string = `流程_${timestamp}`;
    return bpmnStr(key ? key : newId, name ? name : newName);
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

const getNodeType = (type: string) => {
    switch (type) {
        case "bpmn:StartEvent":
            return "start";
        case "bpmn:EndEvent":
            return "end";
        case "bpmn:ParallelGateway":
            return "parallel";
        case "bpmn:InclusiveGateway":
            return "inclusive";
        case "bpmn:ExclusiveGateway":
            return "exclusive";
        case "start":
            return "startEvent";
        case "end":
            return "endEvent";
        case "parallel":
            return "parallelGateway";
        case "inclusive":
            return "inclusiveGateway";
        case "exclusive":
            return "exclusiveGateway";
        case "activity":
            return "userTask";
        default:
            return "activity";
    }
}

/**
 * 根据主流程构建solon-flow-json-code
 * @param element
 */
export const toSolonJson = (element: Element) => {
    if (isType(element.type, "bpmn:Process")) {
        const layouts: SolonFlowNode[] = [];
        element.children.forEach((children: Element) => {
            if (!isType(children.type, ["bpmn:SequenceFlow", "label"])) {
                const links: SolonFlowLink[] = [];
                if (children.outgoing && children.outgoing.length) {
                    children.outgoing.forEach(linkNode => {
                        const link: SolonFlowLink = {
                            nextId: linkNode.target?.id,
                            when: linkNode.businessObject?.conditionExpression?.body,
                            title: linkNode.businessObject.name,
                            meta: linkNode.businessObject.meta,
                            id: linkNode.id,
                        };
                        links.push(link);
                    });
                }
                const node: SolonFlowNode = {
                    id: children.id,
                    title: children.businessObject.name,
                    type: getNodeType(children.type),
                    when: children.businessObject.when,
                    meta: children.businessObject.meta,
                    task: children.businessObject.task,
                    link: links,
                };
                layouts.push(node);
            }
        });
        const data: SolonFlowChina = {
            id: element.id,
            title: element.businessObject.name,
            driver: element.businessObject.driver,
            meta: element.businessObject.meta,
            layout: layouts,
            bpmn: {
                ...element.di,
                planeElement: element.di.planeElement.map((node: any) => ({...node, bpmnElement: node.bpmnElement.id}))
            }
        };
        return data;
    }
    return {};
}

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<definitions id="definitions" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
    typeLanguage="http://www.w3.org/2001/XMLSchema"
    expressionLanguage="http://www.w3.org/1999/XPath">`;


const bpmnStr = (key: string, name: string) => {
    return `${xmlHeader}
<process id="${key}" name="${name}" isExecutable="true">
    <startEvent id="StartEvent_1y45yut" name="开始">
    </startEvent>
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${key}">
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="192" y="250" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="199" y="293" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
};

export const toBpmnXml = (json: SolonFlowChina) => {
    return `${xmlHeader}
        <process id="${json.id}" name="${json.title}" isExecutable="true" driver="${json.driver || ''}" meta="${json.meta || '{}'}">
            ${createNodeXml(json.layout)}
        </process>
        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
            <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${json.id}">
                ${jsonToXml(json.bpmn)}
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </definitions>`;
}

export const createNodeXml = (nodes: SolonFlowNode[]) => {
    const sequenceFlows: any[] = [];
    const data: any[] = nodes.map((node: SolonFlowNode) => {
        if (node.link.length) {
            node.link.forEach(item => {
                sequenceFlows.push({
                    type: "sequenceFlow",
                    id: item.id,
                    title: item.title,
                    meta: item.meta,
                    when: item.when,
                    sourceRef: node.id,
                    targetRef: item.nextId
                });
            });
        }
        return {
            type: getNodeType(node.type),
            id: node.id,
            name: node.title,
            when: node.when,
            meta: node.meta,
            task: node.task,
        };
    });
    const flowData: any[] = data.filter(item => {
        sequenceFlows.forEach((flow: any) => {
            if (flow.targetRef === item.id) {
                item.outgoing = [...(item.outgoing || []), flow.id];
            }
            if (flow.sourceRef === item.id) {
                item.incoming = [...(item.incoming || []), flow.id];
            }
        })
        return true;
    }).concat(sequenceFlows);
    let str = ``;
    flowData.forEach((node) => {
        if (node.type !== "sequenceFlow") {
            str += `<${node.type} id="${node.id}" name="${node.name || ''}" when="${node.when || ''}"
                        task="${node.task || ''}" mata="${node.meta || '{}'}">
                    ${createComing(node)}
                </${node.type}>`
        } else {
            str += `<${node.type} id="${node.id}"
                    name="${node.title || ''}" mata="${node.meta || '{}'}"
                    sourceRef="${node.sourceRef}" targetRef="${node.targetRef}">
                    ${node.when ? `<conditionExpression xsi:type="tFormalExpression">${node.when}</conditionExpression>` : ``}
                </${node.type}>`
        }
    });
    return str;
}

const createComing = (node: any) => {
    let str = ``;
    if (node && node.incoming) {
        node.incoming.forEach((item: string) => {
            str += `<incoming>${item}</incoming>`
        });
    }
    if (node && node.outgoing) {
        node.outgoing.forEach((item: string) => {
            str += `<outgoing>${item}</outgoing>`
        });
    }
    return str;
}

const jsonToXml = (json: any)=> {
    let xml = ``;
    if (json.planeElement) {
        json.planeElement.forEach((element: any) => {
            xml += `<${element.$type} id="${element.id}" bpmnElement="${element.bpmnElement}"
                ${element['background-color'] ? `background-color="${element['background-color']}"` : ``}
                ${element['border-color'] ? `border-color="${element['border-color']}"` : ``}
                ${element['stroke'] ? `stroke="${element['stroke']}"` : ``}
                ${element['fill'] ? `fill="${element['fill']}"` : ``}
                >`;
            if (element.$type === 'bpmndi:BPMNShape') {
                xml += createBounds(element);
            } else {
                xml += createWaypoint(element);
            }
            xml += `</${element.$type}>`;
        });
    }
    return xml;
}

const createBounds = (element: any)=> {
    let str = ``;
    if (element.bounds) {
        str += `<omgdc:Bounds x="${element.bounds.x}" y="${element.bounds.y}" width="${element.bounds.width}" height="${element.bounds.height}"/>`;
    }
    if (element.label) {
        str += `<bpmndi:BPMNLabel>${createBounds(element.label)}</bpmndi:BPMNLabel>`
    }
    return str;
}

const createWaypoint = (element: any)=> {
    let str = ``;
    if (element.waypoint) {
        if (element.waypoint.length > 1) {
            element.waypoint.forEach((point: any) => {
                str += `<omgdi:waypoint x="${point.x}" y="${point.y}" />`;
            });
        }
    }
    return str;
}
