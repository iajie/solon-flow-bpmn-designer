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
