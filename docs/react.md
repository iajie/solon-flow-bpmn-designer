# React集成
?> 这边我将它封装为组件
## 组件封装
```javascript
import React from "react";
import { SolonFlowBpmnDesigner, SolonFlowBpmnDesignerOptions } from 'solon-flow-bpmn-designer';
import "solon-flow-bpmn-designer/style.css";

export interface SolonFlowDesignerRef {
    /**
     * 属性面板显隐控制
     */
    panelShow: () => boolean;
    /**
     * 清除设计器
     */
    clear: () => void;
    /**
     * 获取值
     */
    getValue: () => string | undefined;
}

const SolonFlowDesigner = React.forwardRef<SolonFlowDesignerRef, SolonFlowBpmnDesignerOptions>((props, ref) => {
    const designerRef = React.useRef(null);
    const [designer, setDesigner] = React.useState<SolonFlowBpmnDesigner>();

    React.useImperativeHandle(ref, () => ({
        panelShow: () => designer?.showPanel() || false,
        clear: () => designer?.clear(),
        getValue: () => designer?.getValue(),
    }));

    React.useEffect(() => {
        if (!!designerRef.current && !designer) {
            const solonFlowBpmnDesigner = new SolonFlowBpmnDesigner({
                ...props,
                container: designerRef.current,
                height: props.height || 60,
                lang: props.lang || 'zh',
                theme: props.theme || 'light',
                value: props.value,
                valueType: props.type,
                onChange: (callback) => {
                    props.onChange?.(callback(props.type || 'yaml'));
                },
            });
            setDesigner(solonFlowBpmnDesigner);
            return () => solonFlowBpmnDesigner.destroy();
        }
    }, []);

    React.useEffect(() => {
        if (designer) {
            designer.changeLocal(props.lang || 'cn');
        }
    }, [props.lang]);

    React.useEffect(() => {
        if (designer) {
            designer.changeTheme();
        }
    }, [props.theme]);

    return <div ref={designerRef}/>
});

export default SolonFlowDesigner;
```

## 使用代码
> 使用代码

```javascript
import React from 'react';
import SolonFlowDesigner, { SolonFlowDesignerRef } from './components/SolonFlowDesigner';

const App: React.FC = () => {

    const ref = React.useRef<SolonFlowDesignerRef>(null);
    const [value, setValue] = React.useState<string>('');
    const [options, setOptions] = React.useState<{ theme: "light" | "dark"; lang: "en" | "zh", type: "yaml" | "json" }>({
        theme: 'light',
        lang: 'zh',
        type: 'yaml',
    });

    return <div>
        <button onClick={() => setOptions({ ...options, lang: options.lang === 'en' ? 'zh' : 'en' })}>切换语言</button>
        <button onClick={() => setOptions({ ...options, theme: options.theme === 'dark' ? 'light' : 'dark' })}>切换主题</button>
        <button onClick={() => ref.current?.panelShow()}>属性面板显隐</button>
        <SolonFlowDesigner ref={ref} value={value} onChange={(value) => {
            setValue(value)
        }} height={95}
                           lang={options.lang} theme={options.theme} type={options.type} />
    </div>;
}

export default App
```

## 设计器组件封装代码
```javascript
import React, { Fragment, ReactNode } from 'react';
import { Popover, Spin } from 'antd';
import { SolonFlowBpmnViewer, SolonFlowBpmnViewerProps } from 'solon-flow-bpmn-designer';
import html2canvas from 'html2canvas';

type PopoverProps = {
    /**
     * @description 状态
     */
    status: string;
    /**
     * @description 弹出框内容
     */
    content: ReactNode;
    /**
     * @description 弹出框所在元素高度
     */
    height: number;
    /**
     * @description 弹出框所在元素宽度
     */
    width: number;
    /**
     * @description 弹出框是否显示
     */
    display: 'none' | 'block';
    /**
     * @description 定位位置
     */
    top: number;
    /**
     * @description 定位位置
     */
    left: number;
};

interface SolonFlowViewer extends Omit<SolonFlowBpmnViewerProps, 'container' | 'onClick'> {
    /**
     * @description 点击事件，可能需要业务侧异步查询节点信息
     * @param element 节点信息
     */
    onSelect?: (element: { id: string } & any) => Promise<any>;
    /**
     * 弹出框渲染
     * @param content 异步查询内容
     */
    popoverRender?: (content: any) => ReactNode;
}

/**
 * 设计器(流程图回显)
 * @param height
 * @param props
 */
export default ({ ...props }: SolonFlowViewer) => {

    const containerRef = React.useRef(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<ReactNode>();
    const [popover, setPopover] = React.useState<PopoverProps & any>({
        height: 80,
        width: 100,
        display: 'none',
        top: 0,
        left: 0,
    });

    React.useEffect(() => {
        if (!!props.value && containerRef.current) {
            const bpmn = new SolonFlowBpmnViewer({
                onClick: async (element, svg) => {
                    const position = svg.getBoundingClientRect();
                    const data = {
                        ...element,
                        display: 'block',
                        width: position.width,
                        height: position.height,
                        top: position.y,
                        left: position.x,
                    };
                    setPopover(data);
                    setLoading(true)
                    if (props.onSelect) {
                        props.onSelect(element).then((res) => {
                            setLoading(false);
                            if (props.popoverRender) {
                                setContent(props.popoverRender(res));
                            }
                        });
                    }
                },
                customDownload: (viewer) => {
                    html2canvas(viewer, {
                        useCORS: true,
                        scale: 2, // 提高分辨率
                    }).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.download = `solon-flow-bpmn-viewer-${new Date().getSeconds()}.png`;
                        link.href = imgData;
                        link.click();
                    });
                    html2canvas(viewer);
                },
                ...props,
                container: containerRef.current,
            });
            // 及时销毁画布
            return () => bpmn && bpmn.destroy();
        }
    }, [props]);

    return <Fragment>
        <div id="solon-flow-bpmn-viewer" style={{ border: '1px solid red' }} ref={containerRef}/>
        {typeof props.value !== 'string' && <Popover placement="top" title={popover.name || popover.id} content={<Spin spinning={loading}>
            {content && content}
        </Spin>}>
            <div id="popover" style={{
                width: `${popover.width}px`,
                height: `${popover.height}px`,
                display: `${popover.display}`,
                position: 'fixed',
                zIndex: 1000,
                top: `${popover.top}px`,
                left: `${popover.left}px`,
            }}></div>
        </Popover>}
    </Fragment>
}
```