import {EasyBpmnDesignerOptions} from "../core/EasyBpmnDesigner.ts";
import { Create, ElementFactory } from "bpmn-js/lib/features/palette/PaletteProvider";

export const initModelerStr = (key?: string, name?: string, type?: EasyBpmnDesignerOptions['prefix']) => {
    const timestamp = Date.now();
    const newId: string = `Process_${timestamp}`;
    const newName: string = `业务流程_${timestamp}`;
    return bpmnStr(key ? key : newId, name ? name : newName, type);
};

const bpmnStr = (key: string, name: string, type: EasyBpmnDesignerOptions['prefix'] = 'flowable') => {
    const TYPE_TARGET = {
        activiti: 'http://activiti.org/bpmn',
        camunda: 'http://bpmn.io/schema/bpmn',
        flowable: 'http://flowable.org/bpmn',
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
  <bpmn2:process id="${key}" name="${name}" isExecutable="true">
    <bpmn2:startEvent id="Event_0fx15r3" name="开始">
      <bpmn2:outgoing>Flow_01qhgrr</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="ApplyUserTask" name="申请人" flowable:emptyStrategy="specified_user">
      <bpmn2:extensionElements>
        <flowable:buttonConfig id="btn_agree" name="重新提交" type="agree" sort="1" enabled="true" />
        <flowable:buttonConfig id="btn_revoke" name="撤销" type="revoke" sort="4" enabled="true" />
      </bpmn2:extensionElements>
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
</bpmn2:definitions>`
}

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
        const shape = elementFactory.createShape(Object.assign({ type: type }, options))

        if (options) {
            !shape.businessObject.di && (shape.businessObject.di = {})
            shape.businessObject.di.isExpanded = (options as { [key: string]: any }).isExpanded
        }

        create.start(event, shape)
    }

    return {
        group: group,
        className: className,
        title: title,
        action: {
            dragstart: createListener,
            click: createListener
        }
    }
}

export const downloadFile = (content: string, filename: string, type = 'text/xml') => {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
}