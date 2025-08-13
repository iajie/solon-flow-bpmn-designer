// @ts-ignore
import {EasyBpmnDesignerOptions} from "../core/EasyBpmnDesigner.ts";
import {Create} from "bpmn-js/lib/features/palette/PaletteProvider";
import { BpmnFactory, Element, ElementFactory, Modeler, Modeling, Shape } from "bpmn-js";
import {SolonFlowChina, SolonFlowLink, SolonFlowNode} from "../types/easy-bpmn-designer.ts";
import jsYaml from "js-yaml";

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

export const updateProperty = (key: string, value: any, element?: Element, modeler?: Modeler) => {
    if (!element || !modeler) return;
    const modeling = modeler.get("modeling");
    try {
        const updateObj: Record<string, any> = {};
        updateObj[key] = value;
        // 使用原始元素进行更新
        modeling.updateProperties(element, updateObj);
        // 更新本地状态
    } catch (error) {
        console.error("Failed to update property:", error);
    }
}

/**
 * 添加更新条件表达式的方法
 * @param type
 * @param expression
 * @param element
 * @param modeler
 */
export const updateCondition = (type: string, expression: string = "", element?: Element, modeler?: Modeler) => {
    if (!element || !modeler) return;
    const bpmnFactory = modeler.get("bpmnFactory");
    const modeling = modeler.get("modeling");
    try {
        if (type === "expression") {
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
}


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

const getBpmnNode = (type: string) => {
    switch (type) {
        case "start":
            return "bpmn:StartEvent";
        case "end":
            return "bpmn:EndEvent";
        case "parallel":
            return "bpmn:ParallelGateway";
        case "inclusive":
            return "bpmn:InclusiveGateway";
        case "exclusive":
            return "bpmn:ExclusiveGateway";
        default:
            return "bpmn:UserTask";
    }
}

const sequenceFlows = (nodes: SolonFlowNode[]) => {
    const sequenceFlows: any[] = [];
    if (nodes.length <= 1) return sequenceFlows;
    nodes.map((node: SolonFlowNode, index) => {
        if (node.link) {
            if (Array.isArray(node.link)) {
                node.link.forEach(item => {
                    if (typeof item === "string") {
                        sequenceFlows.push({ id: `SequenceFlows_${index}`, sourceRef: node.id, targetRef: item });
                    } else {
                        sequenceFlows.push({
                            id: item.id || `SequenceFlows_${index}`,
                            sourceRef: node.id,
                            targetRef: item.nextId,
                            when: item.when,
                            name: item.title,
                        });
                    }
                });
            } else if(typeof node.link === "object") {
                sequenceFlows.push({
                    id: node.id || `SequenceFlows_${index}`,
                    sourceRef: node.id,
                    targetRef: node.link.nextId,
                    when: node.link.when,
                    name: node.link.title,
                });
            } else {
                sequenceFlows.push({ id: `SequenceFlows_${index}`, sourceRef: node.id, targetRef: node.link });
            }
        } else {
            if (node.type !== 'end' && index !== nodes.length - 1) {
                sequenceFlows.push({ id: `SequenceFlows_${index}`, sourceRef: node.id, targetRef: nodes[index+1].id });
            }
        }
    });
    return sequenceFlows;
}


/**
 * 创建节点
 * @param modeler bpmn模型
 * @param nodes 生成节点
 */
export const createTaskShape = (modeler?: Modeler, nodes?: SolonFlowNode[])=> {
    if (!modeler || !nodes || !nodes.length) {
        return;
    }
    //获取根节点
    const canvas = modeler.get('canvas');
    const rootElement = canvas.getRootElement();
    const modeling = modeler.get('modeling');
    const elementFactory = modeler.get('elementFactory');
    const bpmnFactory = modeler.get('bpmnFactory');
    const elements: Element[] = [];
    const newNodes = nodes.filter((item, index) => {
        for (const key in item) {
            if (key.startsWith("meta.")) {
                if (!item.meta) {
                    item.meta = {};
                }
                const metaKey = key.split(".")[1];
                // @ts-ignore
                item.meta[metaKey] = item[key];
            }
        }
        const nodeType = getBpmnNode(item.type);
        const node = elementFactory.createShape({
            id: item.id || `${nodeType}_${index}`,
            type: nodeType,
        });
        item.id = node.id;
        if (item.title) {
            node.businessObject.name = item.title;
        }
        if (item.task) {
            node.businessObject.task = item.task;
        }
        if (item.when) {
            node.businessObject.when = item.when;
        }
        if (item.meta) {
            node.businessObject.meta = JSON.stringify(item.meta, null, 2);
        }
        elements.push(node as Shape);
        return true;
    });
    modeling.createElements(elements, { x: 192, y: 250 }, <any>rootElement);
    // 连线
    connection(sequenceFlows(newNodes), elements, modeling, bpmnFactory);
}

const connection = (links: any[], elements: Element[], modeling: Modeling, bpmnFactory: BpmnFactory) => {
    links.forEach(item => {
        // 目标节点
        const node = elements.find(node => node.id === item.sourceRef);
        if (node) {
            const target = elements.find(node => node.id === item.targetRef);
            if (target) {
                const connect = modeling.connect(node, target);
                if (item.name) {
                    connect.businessObject.name = item.name;
                }
                if (item.when) {
                    connect.businessObject.conditionExpression = bpmnFactory.create("bpmn:FormalExpression", {
                        body: item.when,
                    });
                }
            }
        }
    });
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
                        const obj = linkNode.businessObject;
                        const link: SolonFlowLink = {
                            nextId: linkNode.target?.id,
                            when: obj?.conditionExpression?.body,
                            title: obj.name,
                            id: linkNode.id,
                        };
                        links.push(link);
                    });
                }
                const node: SolonFlowNode = {
                    id: children.id,
                    title: children.businessObject.name,
                    type: getNodeType(children.type),
                    task: children.businessObject.task,
                    meta: children.businessObject.meta ? jsYaml.load(children.businessObject.meta) as any : undefined,
                    when: children.businessObject.when,
                    link: links,
                };
                layouts.push(node);
            }
        });
        const data: SolonFlowChina = {
            id: element.id,
            title: element.businessObject.name,
            driver: element.businessObject.driver,
            meta: element.businessObject.meta ? jsYaml.load(element.businessObject.meta) as any : undefined,
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
    expressionLanguage="http://www.w3.org/1999/XPath"
    targetNamespace="http://solon.flow/bpmn">`;

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
        <process id="${json.id}" name="${json.title}" isExecutable="true"${json.driver ? ` solon:driver="${json.driver}` : ``}${json.meta ? ` solon:meta="${JSON.stringify(json.meta).replace(/"/g, '\'')}"` : ``}>
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
        if (node.link) {
            (node.link as SolonFlowLink[]).forEach(item => {
                sequenceFlows.push({
                    type: "sequenceFlow",
                    id: item.id,
                    name: item.title,
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
            str += `<${node.type} id="${node.id}"${node.name ? ` name="${node.name}"` : ``}${node.when ? ` solon:when="${node.when}"` : ``}${node.task ? ` solon:task="${node.task}"` : ``}${node.meta ? ` solon:meta="${JSON.stringify(node.meta).replace(/"/g, '\'')}"` : ``}>
                    ${createComing(node)}
                </${node.type}>`
        } else {
            str += `<${node.type} id="${node.id}"${node.name ? ` name="${node.name}"` : ``} sourceRef="${node.sourceRef}" targetRef="${node.targetRef}">
                    ${node.when ? `<conditionExpression xsi:type="tFormalExpression">${node.when.replace(/[<>&]/g, (match: string) => {if(match === '<') return "&lt;"; if(match === '>') return "&gt;"; if (match === "&") return "&amp;";})}</conditionExpression>` : ``}
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
            xml += `<${element.$type} id="${element.id}" bpmnElement="${element.bpmnElement}" ${element['background-color'] ? `background-color="${element['background-color']}"` : ``} ${element['border-color'] ? `border-color="${element['border-color']}"` : ``} ${element['stroke'] ? `stroke="${element['stroke']}"` : ``} ${element['fill'] ? `fill="${element['fill']}"` : ``}>`;
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
