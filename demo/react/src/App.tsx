import React from 'react';
import { SolonFlowDesignerRef, SolonFlowDesigner } from './components';
import { Button, Space } from "antd";
import Viewer from "./Viewer.tsx";
import { xmlStr } from "./default.ts";

const App: React.FC = () => {

    const ref = React.useRef<SolonFlowDesignerRef>(null);
    const [value, setValue] = React.useState<string>(xmlStr);
    const [options, setOptions] = React.useState<{ theme: "light" | "dark"; lang: "en" | "zh", type: "yaml" | "json" }>({
        theme: 'light',
        lang: 'zh',
        type: 'yaml',
    });

    const [viewer, setViewer] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<boolean>(false);

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
        { viewer ? <Viewer mode={mode}/> : <SolonFlowDesigner
            ref={ref}
            value={value}
            onChange={(value: any) => {
                setValue(value)
            }}
            height={92}
            lang={options.lang}
            theme={options.theme}
            type={options.type} /> }

    </div>;
}

export default App
