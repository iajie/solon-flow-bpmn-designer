// @ts-ignore
import { EasyBpmnDesignerOptions } from "../core/EasyBpmnDesigner.ts";
import {
  Create,
  ElementFactory,
} from "bpmn-js/lib/features/palette/PaletteProvider";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { BpmnElement, BpmnFactory, Modeling } from "bpmn-js";
import { t } from "i18next";

export const initModelerStr = (
  key?: string,
  name?: string,
  type?: EasyBpmnDesignerOptions["prefix"]
) => {
  const timestamp = Date.now();
  const newId: string = `Process_${timestamp}`;
  const newName: string = `业务流程_${timestamp}`;
  return bpmnStr(key ? key : newId, name ? name : newName, type);
};

const bpmnStr = (
  key: string,
  name: string,
  type: EasyBpmnDesignerOptions["prefix"] = "flowable"
) => {
  const TYPE_TARGET = {
    activiti: "http://activiti.org/bpmn",
    camunda: "http://bpmn.io/schema/bpmn",
    flowable: "http://flowable.org/bpmn",
  } as any;

  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="diagram_${key}"
  targetNamespace="${TYPE_TARGET[type]}">
  <bpmn2:process id="${key}" name="${t(name)}" isExecutable="true">
    <bpmn2:startEvent id="Event_0fx15r3" name="${t('startLabel')}">
      <bpmn2:outgoing>Flow_01qhgrr</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="ApplyUserTask" name="${t('assigneeLabel')}" 
      flowable:assigneeType="user" 
      flowable:buttonConfig="[&#34;approve&#34;,&#34;revoke&#34;]" 
      flowable:emptyHandlerType="autoApprove" 
      flowable:returnType="restart">
      <bpmn2:incoming>Flow_01qhgrr</bpmn2:incoming>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="Flow_01qhgrr" sourceRef="Event_0fx15r3" targetRef="ApplyUserTask" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
      <bpmndi:BPMNShape id="Event_0fx15r3_di" bpmnElement="Event_0fx15r3">
        <dc:Bounds x="192" y="322" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="199" y="365" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1fdrcox_di" bpmnElement="ApplyUserTask">
        <dc:Bounds x="280" y="300" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_01qhgrr_di" bpmnElement="Flow_01qhgrr">
        <di:waypoint x="228" y="340" />
        <di:waypoint x="280" y="340" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;
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

export const downloadFile = (
  content: string,
  filename: string,
  type = "text/xml"
) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const updateProperty = (
  key: string,
  value: any,
  element?: BpmnElement,
  modeler?: BpmnModeler
) => {
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

export const updateMultiInstance = (
  type: string,
  element?: BpmnElement,
  modeler?: BpmnModeler
) => {
  if (!element || !modeler) return;
  const bpmnFactory = modeler.get("bpmnFactory") as BpmnFactory;
  const modeling = modeler.get("modeling") as Modeling;
  try {
    if (type) {
      // 创建多实例特性
      const loopCharacteristics = bpmnFactory.create(
        "bpmn:MultiInstanceLoopCharacteristics",
        { isSequential: type === "sequential" }
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
export const updateCondition = (
  type: string,
  expression: string = "",
  element?: BpmnElement,
  modeler?: BpmnModeler
) => {
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
