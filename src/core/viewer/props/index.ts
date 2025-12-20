import { BpmnElement } from "bpmn-js";
import { Instance } from "tippy.js";

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
     * @description 设计器数据xml
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
    value: string | NodeType;
    valueType?: 'bpmn' | 'json' | 'yaml';
    /**
     * @description 主题
     * @default light
     */
    theme?: 'dark' | 'light';
    /**
     * @description 语言
     * @default zh
     */
    lang?: string | 'zh' | 'en';
    /**
     * @description 国际化
     */
    i18n?: Record<string, Record<string, string>>;
    /**
     * @description 流程图查看器高度(屏幕可视高度)
     * @default 60
     */
    height?: number;
    /**
     * @description 显示模式，read为单显示为设计器样式，active为流程动态
     * @default read
     */
    mode?: 'read' | 'active';
    /**
     * 活动节点设置
     */
    active?: Stateful[];
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
     * 自定义渲染点击弹出框
     * @param render 点击异步获取的内容
     */
    popoverRender?: (render: any, tippy: Instance) => void;
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
    lang: "zh",
    theme: "light",
    valueType: 'yaml',
    mode: "read",
    height: 50,
    toolbar: true,
}

export {
    NodeColor, defaultViewerOptions
}

export type {
    Color, SolonFlowBpmnViewerProps, Stateful
}
