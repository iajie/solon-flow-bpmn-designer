import React from 'react';
import SolonFlowViewer from "./components/SolonFlowViewer.tsx";
import { SolonFlowBpmnViewerProps } from "solon-flow-bpmn-designer";

const Viewer: React.FC<{ mode: SolonFlowBpmnViewerProps['mode'] }> = (props) => {

    const [value] = React.useState<string>('id: sf1\n' +
        'title: sf1\n' +
        'layout:\n' +
        '  - id: step1\n' +
        '    type: activity\n' +
        '    title: 发起审批\n' +
        '    meta: {actor: 刘涛, form: form1}\n' +
        '    link:\n' +
        '    - {nextId: step2}\n' +
        '  - id: step2\n' +
        '    type: activity\n' +
        '    title: 抄送\n' +
        '    meta: {cc: 吕方}\n' +
        '    task: \'@OaMetaProcessCom\'\n' +
        '    link:\n' +
        '    - {nextId: step3}\n' +
        '  - id: step3\n' +
        '    type: activity\n' +
        '    title: 审批\n' +
        '    meta: {actor: 陈鑫, cc: 吕方}\n' +
        '    task: \'@OaMetaProcessCom\'\n' +
        '    link:\n' +
        '    - {nextId: step4}\n' +
        '  - id: step4\n' +
        '    type: parallel\n' +
        '    title: 审批\n' +
        '    link:\n' +
        '    - {nextId: step4_1}\n' +
        '    - {nextId: step4_2}\n' +
        '  - id: step4_1\n' +
        '    type: activity\n' +
        '    meta: {actor: 陈宇}\n' +
        '    link:\n' +
        '    - {nextId: step4_end}\n' +
        '  - id: step4_2\n' +
        '    type: activity\n' +
        '    meta: {actor: 吕方}\n' +
        '    link:\n' +
        '    - {nextId: step4_end}\n' +
        '  - id: step4_end\n' +
        '    type: parallel\n' +
        '    link:\n' +
        '    - {nextId: step5}\n' +
        '  - id: step5\n' +
        '    type: activity\n' +
        '    title: 抄送\n' +
        '    meta: {cc: 吕方}\n' +
        '    task: \'@OaMetaProcessCom\'\n' +
        '    link:\n' +
        '    - {nextId: step6}\n' +
        '  - {id: step6, type: end, title: 结束}\n' +
        'stateful: {step1: COMPLETED, step2: COMPLETED, step3: COMPLETED, step4: COMPLETED}');

    return <SolonFlowViewer value={value} mode={props.mode}/>;
}

export default Viewer;
