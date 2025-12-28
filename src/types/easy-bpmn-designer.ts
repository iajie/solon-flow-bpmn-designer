import { SolonFlowBpmnDesigner } from "../core";

export interface CustomMenu {
    id?: string
    className?: string
    icon?: string
    html?: string
    tip?: string
    onClick?: (event: MouseEvent, designer: SolonFlowBpmnDesigner) => void
}

export interface SolonFlowChina {
    /**
     * @description 标识
     */
    id: string;
    /**
     * @description 标题
     */
    title?: string;
    /**
     * @description 驱动器（缺省为默认驱动器）
     */
    driver?: string;
    /**
     * @description 元数据，存储bpmn节点信息
     */
    meta?: Record<string, any>;
    /**
     * @description 子节点
     */
    layout: SolonFlowNode[];
    /**
     * @description 存储bpmn节点样式位置等信息
     */
    v_bpmn: Record<string, any>;
    /**
     * @description 节点状态
     */
    stateful?: Record<string, any>;
}

export interface SolonFlowNode {
    /**
     * @description 节点ID
     */
    id?: string;
    /**
     * @description 节点类型
     */
    type: string;
    /**
     * @description 节点标题
     */
    title?: string;
    /**
     * @description 任务执行条件描述（会触发驱动的 handleTest 处理）
     */
    when?: string;
    /**
     * @description 任务描述（会触发驱动的 handleTask 处理）
     */
    task?: string;
    /**
     * @description 元数据
     */
    meta?: Record<string, any>;
    /**
     * @description 连接
     */
    link: SolonFlowLink[] | string | string[] | SolonFlowLink;
}

export interface SolonFlowLink {
    /**
     * @description 下一节点ID
     */
    nextId?: string;
    /**
     * @description 分支流出条件描述（会触发驱动的 handleTest 处理）
     */
    when?: string;
    /**
     * @description 标题
     */
    title: string;
    /**
     * @description 存储bpmn节点id
     */
    id: string;

    [key: string]: any;
}
