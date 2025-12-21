import { BpmnElement } from "bpmn-js";

type Color = 'success' | 'process' | 'danger' | 'warning' | 'cyan' | 'purple';

const NodeColor = {
    success: {
        stroke: '#52c41a',
        fill: '#f6ffed'
    },
    process: {
        stroke: '#4096ff',
        fill: '#e6f4ff',
        strokeDasharray: '5, 5',
    },
    danger: {
        stroke: '#ff4d4f',
        fill: '#fff1f0'
    },
    warning: {
        stroke: '#ffa940',
        fill: '#fff7e6'
    },
    cyan: {
        stroke: '#36cfc9',
        fill: '#e6fffb'
    },
    purple: {
        stroke: '#9254de',
        fill: '#f9f0ff'
    },
};

type Stateful = {
    /**
     * @description 节点状态
     * 待完成、已完成、已终止。。
     */
    stateType: 'WAITING' | 'COMPLETED' | 'TERMINATED' | string;
    /**
     * @description 激活的节点ID
     */
    activeNodeIds?: string[];
    /**
     * @description 激活节点样式
     * {@link Color}
     */
    activeColor: Color;
}

type NodeType = {
    /**
     * @description 设计器数据yml
     */
    data: string;
    /**
     * 节点状态,当mode=active时生效
     */
    stateful?: Stateful[];
}

type SolonFlowBpmnViewerProps = {
    /**
     * @description 挂载dom/id
     */
    container: string | HTMLElement;
    /**
     * @description 流程图值，仅支持solon-flow的yaml/json
     * 如果是{@link NodeType}则可以展示流程图激活 状态
     */
    value: string | NodeType;
    /**
     * @description 流程图查看器高度(屏幕可视高度)
     * @default 60
     */
    height?: number;
    /**
     * @description 排除节点；类型，如果添加点击节点将不会弹出框
     */
    excludeType?: string[];
    /**
     * @description 点击事件
     * @param node 节点信息
     */
    onClick?: (node: BpmnElement['businessObject'], graphics: SVGElement) => Promise<void>;
    /**
     * 是否显示工具栏
     */
    toolbar?: boolean;
    /**
     * 针对下载图片没有样式，可以通过得到流程图dom配合第三方库进行导出例如html2canvas
     * @param viewer
     */
    customDownload?: (viewer: HTMLElement) => void;
}

const defaultViewerOptions: Partial<SolonFlowBpmnViewerProps> = {
    height: 50,
    toolbar: true,
}

export {
    NodeColor, defaultViewerOptions
}

export type {
    Color, SolonFlowBpmnViewerProps, Stateful
}
