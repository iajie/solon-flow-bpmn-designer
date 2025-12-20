import React from 'react';
import SolonFlowDesigner, { SolonFlowDesignerRef } from './components/SolonFlowDesigner';
import { Button, Space } from "antd";
import Viewer from "./Viewer.tsx";

const App: React.FC = () => {

    const ref = React.useRef<SolonFlowDesignerRef>(null);
    const [value, setValue] = React.useState<string>('id: Chain_1755048792645\n' +
        'title: 流程_1755048792645\n' +
        'layout:\n' +
        '  - id: StartEvent_1y45yut\n' +
        '    title: 开始\n' +
        '    type: start\n' +
        '    link:\n' +
        '      - nextId: Activity_1ty2hs0\n' +
        '        id: Flow_0jmc9kr\n' +
        '  - id: Activity_1ty2hs0\n' +
        '    type: activity\n' +
        '    link:\n' +
        '      - nextId: Event_07wmxit\n' +
        '        id: Flow_080fc8o\n' +
        '  - id: Event_07wmxit\n' +
        '    type: end\n' +
        '    link: []\n' +
        'bpmn:\n' +
        '  $type: bpmndi:BPMNPlane\n' +
        '  id: BpmnPlane_1\n' +
        '  planeElement:\n' +
        '    - $type: bpmndi:BPMNShape\n' +
        '      id: StartEvent_1y45yut_di\n' +
        '      bounds:\n' +
        '        $type: dc:Bounds\n' +
        '        x: 192\n' +
        '        \'y\': 250\n' +
        '        width: 36\n' +
        '        height: 36\n' +
        '      label:\n' +
        '        $type: bpmndi:BPMNLabel\n' +
        '        bounds:\n' +
        '          $type: dc:Bounds\n' +
        '          x: 199\n' +
        '          \'y\': 293\n' +
        '          width: 23\n' +
        '          height: 14\n' +
        '      bpmnElement: StartEvent_1y45yut\n' +
        '    - $type: bpmndi:BPMNShape\n' +
        '      bounds:\n' +
        '        $type: dc:Bounds\n' +
        '        x: 280\n' +
        '        \'y\': 228\n' +
        '        width: 100\n' +
        '        height: 80\n' +
        '      id: Activity_1ty2hs0_di\n' +
        '      bpmnElement: Activity_1ty2hs0\n' +
        '    - $type: bpmndi:BPMNEdge\n' +
        '      waypoint:\n' +
        '        - $type: dc:Point\n' +
        '          x: 228\n' +
        '          \'y\': 268\n' +
        '        - $type: dc:Point\n' +
        '          x: 280\n' +
        '          \'y\': 268\n' +
        '      id: Flow_0jmc9kr_di\n' +
        '      bpmnElement: Flow_0jmc9kr\n' +
        '    - $type: bpmndi:BPMNShape\n' +
        '      bounds:\n' +
        '        $type: dc:Bounds\n' +
        '        x: 432\n' +
        '        \'y\': 250\n' +
        '        width: 36\n' +
        '        height: 36\n' +
        '      id: Event_07wmxit_di\n' +
        '      bpmnElement: Event_07wmxit\n' +
        '    - $type: bpmndi:BPMNEdge\n' +
        '      waypoint:\n' +
        '        - $type: dc:Point\n' +
        '          x: 380\n' +
        '          \'y\': 268\n' +
        '        - $type: dc:Point\n' +
        '          x: 432\n' +
        '          \'y\': 268\n' +
        '      id: Flow_080fc8o_di\n' +
        '      bpmnElement: Flow_080fc8o');
    const [options, setOptions] = React.useState<{ theme: "light" | "dark"; lang: "en" | "zh", type: "yaml" | "json" }>({
        theme: 'light',
        lang: 'zh',
        type: 'yaml',
    });

    const [viewer, setViewer] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<boolean>(false);

    const active = React.useMemo(() => mode ? 'active' : 'read', [mode]);

    return <div>
        {!viewer && <Space.Compact title="设计器">
            <Button onClick={() => setOptions({ ...options, lang: options.lang === 'en' ? 'zh' : 'en' })}>切换语言</Button>
            <Button onClick={() => setOptions({ ...options, theme: options.theme === 'dark' ? 'light' : 'dark' })}>切换主题</Button>
            <Button onClick={() => ref.current?.panelShow()}>属性面板显隐</Button>
        </Space.Compact>}
        <Space.Compact title="流程图">
            <Button onClick={() => {
                setViewer(true);
                setMode(false);
            }} type="dashed">普通流程图</Button>
            <Button onClick={() => setMode(true)} type="dashed">活动流程图</Button>
            {viewer && <Button type="dashed" onClick={() => setViewer(false)}>流程设计器</Button>}
        </Space.Compact>
        { viewer ? <Viewer mode={active}/> : <SolonFlowDesigner
            ref={ref}
            value={value}
            onChange={(value) => {
                setValue(value)
            }}
            height={92}
            lang={options.lang}
            theme={options.theme}
            type={options.type} /> }

    </div>;
}

export default App
