import { BpmnFactory, Element, ElementFactory, Modeler, Modeling, Shape, Create } from "bpmn-js";
import { SolonFlowChina, SolonFlowLink, SolonFlowNode } from "../types/easy-bpmn-designer.ts";
import jsYaml from "js-yaml";
// @ts-ignore
import { layoutProcess } from "bpmn-auto-layout";

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
            Object.assign({ type: type }, options)
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
    const blob = new Blob([content], { type });
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
        case "bpmn:ComplexGateway":
            return "iterator";
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
        case "iterator":
            return "complexGateway";
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
        case "iterator":
            return "bpmn:ComplexGateway";
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
            } else if (typeof node.link === "object") {
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
                sequenceFlows.push({
                    id: `SequenceFlows_${index}`,
                    sourceRef: node.id,
                    targetRef: nodes[index + 1].id
                });
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
export const createTaskShape = (modeler?: Modeler, nodes?: SolonFlowNode[]) => {
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
        node.di.id = `${node.id}_di`;
        node.businessObject.id = node.id;
        item.id = node.id;
        if (item.title) {
            node.businessObject.name = item.title;
        }
        elements.push(node as Shape);
        return true;
    });
    modeling.createElements(elements, { x: 192, y: 250 }, <any>rootElement);
    // 连线
    connection(newNodes, elements, modeling, bpmnFactory);
    return newNodes;
}

const connection = (nodes: any[], elements: Element[], modeling: Modeling, bpmnFactory: BpmnFactory) => {
    const links = sequenceFlows(nodes);
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
                    task: children.businessObject.task?.body,
                    meta: children.businessObject.meta?.body ? jsYaml.load(children.businessObject.meta?.body) as any : undefined,
                    when: children.businessObject.when?.body,
                    link: links,
                };
                layouts.push(node);
            }
        });
        const data: SolonFlowChina = {
            id: element.id,
            title: element.businessObject.name,
            driver: element.businessObject.driver,
            meta: element.businessObject.meta?.body ? jsYaml.load(element.businessObject.meta?.body) as any : undefined,
            layout: layouts,
            bpmn: {
                ...element.di,
                planeElement: element.di.planeElement.map((node: any) => ({
                    ...node,
                    bpmnElement: node.bpmnElement.id
                }))
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

export const toBpmnXml = (json: SolonFlowChina, isColor = true) => {
    return `${xmlHeader}
        <process id="${json.id}" name="${json.title}" isExecutable="true"${json.driver ? ` solon:driver="${json.driver}"` : ``}>
            ${createNodeXml(json.layout)}
            ${json.meta ? `<solon:Meta>${JSON.stringify(json.meta, null, 4)}</solon:Meta>` : ``}
        </process>
        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
            <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${json.id}">
                ${jsonToXml(json.bpmn, isColor)}
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </definitions>`;
}

/**
 * 获取xml可识别的字符串(对于脚本<>&等情况)
 * @param str
 */
const toXmlStr = (str: string) => {
    return str.replace(/[<>&]/g, (match: string) => {
        if (match === '<') return "&lt;";
        if (match === '>') return "&gt;";
        return "&amp;";
    });
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
            str += `<${node.type} id="${node.id}"${node.name ? ` name="${node.name}"` : ``}>
                    ${createComing(node)}
                    ${node.when ? `<solon:When>${toXmlStr(node.when)}</solon:When>` : ``}
                    ${node.task ? `<solon:Task>${toXmlStr(node.task)}</solon:Task>` : ``}
                    ${node.meta ? `<solon:Meta>${JSON.stringify(node.meta, null, 4)}</solon:Meta>` : ``}
                </${node.type}>`
        } else {
            str += `<${node.type} id="${node.id}"${node.name ? ` name="${node.name}"` : ``} sourceRef="${node.sourceRef}" targetRef="${node.targetRef}">
                    ${node.when ? `<conditionExpression xsi:type="tFormalExpression">${toXmlStr(node.when)}</conditionExpression>` : ``}
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

const jsonToXml = (json: any, isColor: boolean) => {
    let xml = ``;
    if (json.planeElement) {
        json.planeElement.forEach((element: any) => {
            xml += `<${element.$type} id="${element.id}" bpmnElement="${element.bpmnElement}" ${isColor && (element['background-color'] ? `background-color="${element['background-color']}"` : ``)} ${isColor && (element['border-color'] ? `border-color="${element['border-color']}"` : ``)} ${isColor && (element['stroke'] ? `stroke="${element['stroke']}"` : ``)} ${isColor && (element['fill'] ? `fill="${element['fill']}"` : ``)}>`;
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

const createBounds = (element: any) => {
    let str = ``;
    if (element.bounds) {
        str += `<omgdc:Bounds x="${element.bounds.x}" y="${element.bounds.y}" width="${element.bounds.width}" height="${element.bounds.height}"/>`;
    }
    if (element.label) {
        str += `<bpmndi:BPMNLabel>${createBounds(element.label)}</bpmndi:BPMNLabel>`
    }
    return str;
}

const createWaypoint = (element: any) => {
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

export const importStr = (text: string, modeler?: Modeler) => {
    const yaml = jsYaml.load(text);
    const solonFlow = yaml as SolonFlowChina;
    const modeling = modeler?.get("modeling");
    const canvas = modeler?.get("canvas");
    const root = canvas?.getRootElement() as Element;
    const rootElement = canvas?.getRootElements()[0];
    // 存在bpmn信息
    if (solonFlow.bpmn) {
        modeler?.importXML(toBpmnXml(solonFlow)).then(({ warnings }) => {
            console.debug(warnings);
        });
    } else {
        if (rootElement) {
            const arr: Element[] = [];
            rootElement.children.forEach((el: any) => {
                if (el.label) {
                    arr.push(el.label);
                }
                arr.push(el);
            });
            modeling?.removeElements(arr);
        }
        updateProperty('id', solonFlow.id, root, modeler);
        updateProperty('name', solonFlow.title || '', root, modeler);
        if (solonFlow.driver) {
            updateProperty('driver', solonFlow.driver, root, modeler);
        } else {
            updateProperty('driver', '', root, modeler);
        }
        // 定义第一节点位置
        const nodes = createTaskShape(modeler, solonFlow.layout);
        const elementRegistry = modeler?.get('elementRegistry');
        const bpmnFactory = modeler?.get("bpmnFactory");
        modeler?.saveXML({ format: true }).then(async ({ xml }) => {
            // 重新布局
            modeler?.importXML(await layoutProcess(xml)).then(() => {
                if (nodes && elementRegistry && bpmnFactory) {
                    // 设置meta
                    if (solonFlow.meta) {
                        const meta = bpmnFactory?.create("solon:Meta", { body: JSON.stringify(solonFlow.meta, null, 4) });
                        const rootNode = elementRegistry.get(solonFlow.id) as Element;
                        rootNode && modeling?.updateProperties(rootNode, { meta });
                    }
                    nodes.forEach(node => {
                        if (node.id) {
                            const el = elementRegistry.get(node.id) as Element;
                            if (el) {
                                if (node.meta) {
                                    const meta = bpmnFactory?.create("solon:Meta", { body: JSON.stringify(node.meta, null, 4) });
                                    modeling?.updateProperties(el, { meta });
                                }
                                if (node.when) {
                                    const when = bpmnFactory?.create("solon:When", { body: node.when });
                                    modeling?.updateProperties(el, { when });
                                }
                                if (node.task) {
                                    const task = bpmnFactory?.create("solon:Task", { body: node.task });
                                    modeling?.updateProperties(el, { task });
                                }
                            }

                        }
                    });
                }
                // 选中主节点
                canvas?.scroll({ dx: 0, dy: 0 });
                // @ts-ignore
                canvas.zoom('fit-viewport', 'auto');
            });
        });
    }
}


/**
 * 下载当前流程设计图片
 */
export const downloadSvg = async (modeler: Modeler) => {
    // svg字符串
    const svgResult = await modeler.saveSVG();
    // 创建画布
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, 10000, 10000);
        const image = new Image();
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgResult.svg)}`;
        image.onload = () => {
            canvas.width = image.width + 100;
            canvas.height = image.height + 200;
            const x = (canvas.width - image.width) / 2;
            const y = (canvas.height - image.height) / 2;
            // 将图片渲染到画布
            context.drawImage(image, x, y);
            const logo = new Image();
            logo.src =
                'data:image/png;base64,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';
            logo.onload = () => {
                context.drawImage(logo, image.width + 20, image.height + 130);
                const a = document.createElement('a');
                a.download = `solon-flow-bpmn-${new Date().getSeconds()}.png`;
                // 画布转图片
                a.href = canvas.toDataURL('image/png');
                a.click();
            };
        };
    }
};
