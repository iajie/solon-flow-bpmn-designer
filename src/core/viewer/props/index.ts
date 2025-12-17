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

type PopoverContent = {
    /**
     * @description 标题
     */
    title?: string;
    /**
     * @description 执行用户
     */
    users?: string[] | HTMLDivElement;
    /**
     * @description 任务开始时间
     */
    startTime?: string | Date;
    /**
     * @description 任务结束时间
     */
    endTime?: string | Date;
    /**
     * @description 任务状态
     */
    status?: string | HTMLDivElement;
    /**
     * @description 耗时
     */
    duration?: number;
}

type NodeType = {
    /**
     * @description 设计器数据xml
     */
    data: string;
    /**
     * 激活节点
     */
    activeNode: string[];
    /**
     * 执行节点
     */
    executeNode: string[];
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
     * @description 流程模式
     */
    active?: {
        /**
         * @description 当前激活的节点
         */
        activeNode?: string[];
        /**
         * @description 激活节点样式
         */
        activeColor?: Color;
        /**
         * @description 已完成节点
         */
        executeNode?: string[];
        /**
         * @description 已完成节点样式
         */
        executeColor?: Color;
    }
    /**
     * @description 排除节点；类型，如果添加点击节点将不会弹出框
     */
    excludeType?: string[];
    /**
     * @description 点击事件
     * @param node 节点信息
     */
    onClick?: (node: BpmnElement['businessObject']) => Promise<any>;
    /**
     * 自定义渲染点击弹出框
     * @param render 点击异步获取的内容
     */
    popoverRender?: (render: any) => HTMLElement;
}

const defaultViewerOptions: Partial<SolonFlowBpmnViewerProps> = {
    lang: "zh",
    theme: "light",
    valueType: 'yaml',
    mode: "read",
    height: 50,
}

export {
    NodeColor, defaultViewerOptions
}

export type {
    Color, PopoverContent, SolonFlowBpmnViewerProps,
}
