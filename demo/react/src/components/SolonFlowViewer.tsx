import { SolonFlowBpmnViewer, SolonFlowBpmnViewerProps } from "solon-flow-bpmn-designer";
import React, { ReactNode } from "react";
import { Descriptions, Popover, Spin } from "antd";
import html2canvas from "html2canvas";

interface SolonFlowViewerProps {
    value: SolonFlowBpmnViewerProps['value'];
    mode: SolonFlowBpmnViewerProps['mode'];
}

type PopoverProps = {
    /**
     * @description 状态
     */
    status: string;
    /**
     * @description 弹出框内容
     */
    content: string | ReactNode;
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
} | any;

const SolonFlowViewer: React.FC<SolonFlowViewerProps> = (props) => {
    const viewerRef = React.useRef(null);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [popover, setPopover] = React.useState<PopoverProps>({
        status: '',
        content: '',
        height: 80,
        width: 100,
        display: 'none',
        top: 0,
        left: 0,
        noting: false,
    });

    React.useEffect(() => {
        if (viewerRef.current) {
            const solonFlowBpmnViewer = new SolonFlowBpmnViewer({
                container: viewerRef.current,
                height: 92,
                value: props.value,
                mode: props.mode,
                active: [{
                    stateType: "COMPLETED",
                    activeColor: "success",
                }, {
                    stateType: "WAITING",
                    activeColor: "process",
                }, {
                    stateType: "TERMINATED",
                    activeColor: "danger"
                }],
                onClick: async (element, svg) => {
                    setLoading(true)
                    setTimeout(() => {
                        setLoading(false);
                        const position = svg.getBoundingClientRect();
                        const data = {
                            author: 'solon-flow',
                            startTime: '2025年12月18日10点54分',
                            endTime: '2025年12月20日10点54分',
                            status: '未知',
                            duration: '一坤年',
                            ...element,
                            display: 'block',
                            width: position.width,
                            height: position.height,
                            top: position.y,
                            left: position.x,
                        };
                        setPopover(data)
                    }, 1000);
                },
                customDownload: (viewer) => {
                    html2canvas(viewer, {
                        useCORS: true,
                        scale: 2, // 提高分辨率
                    }).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.download = 'example.png';
                        link.href = imgData;
                        link.click();
                    });
                    html2canvas(viewer);
                }
            });
            return () => solonFlowBpmnViewer.destroy();
        }
    }, [props, props.mode, props.value]);

    return <div>
        <div ref={viewerRef}/>
        <Popover placement="top" title={popover.name || popover.id} content={<Spin spinning={loading}>
            <Descriptions style={{ maxWidth: '20vw' }} column={1}>
                <Descriptions.Item label="执行人">{popover.author}</Descriptions.Item>
                <Descriptions.Item label="节点状态">{popover.status}</Descriptions.Item>
                <Descriptions.Item label="耗时">{popover.duration}</Descriptions.Item>
                <Descriptions.Item label="开始时间">{popover.startTime}</Descriptions.Item>
                <Descriptions.Item label="结束时间">{popover.endTime}</Descriptions.Item>
            </Descriptions>
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
        </Popover>
    </div>

}


export default SolonFlowViewer;
