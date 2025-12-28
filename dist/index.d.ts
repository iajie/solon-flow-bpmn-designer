import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer';
import { BpmnElement } from 'bpmn-js';
import { Element as Element_2 } from 'bpmn-js';
import { Instance } from 'tippy.js';
import { Modeler } from 'bpmn-js';
import { ModuleDeclaration } from 'bpmn-js';
import { Props } from 'tippy.js';

declare interface Color {
    label: string;
    fill?: string;
    stroke?: string;
}

declare type Color_2 = 'success' | 'process' | 'danger' | 'warning' | 'cyan' | 'purple';

declare interface CustomMenu {
    id?: string;
    className?: string;
    icon?: string;
    html?: string;
    tip?: string;
    onClick?: (event: MouseEvent, designer: SolonFlowBpmnDesigner) => void;
}

declare type DefaultToolbarKey = (typeof defaultToolbarKeys)[number];

declare const defaultToolbarKeys: string[];

export declare const downloadFile: (content: string, filename: string, type?: string) => void;

declare type NodeType = {
    /**
     * @description 设计器数据yml
     */
    data: string;
    /**
     * 节点状态,当mode=active时生效
     */
    stateful?: Stateful[];
};

export declare class SolonFlowBpmnDesigner {
    /**
     * 设计器对象
     */
    private bpmnModeler;
    /**
     * easy-bpmn-designer设计器
     */
    private container;
    /**
     * 属性
     */
    options: SolonFlowBpmnDesignerOptions;
    /**
     * 顶部工具栏
     */
    private toolbar;
    /**
     * 设计器
     */
    private designer;
    /**
     * 属性面板
     */
    private panel;
    /**
     * 事件传递组件
     * @private
     */
    private eventComponents;
    constructor(options: SolonFlowBpmnDesignerOptions);
    /**
     * 初始化
     * @private
     */
    private initialize;
    protected innerBpmnModeler(): void;
    protected onCreated(): void;
    private setupKeyboard;
    private addListenerEvent;
    /**
     * 设置设计器值
     * 注意：暂不支持无bpmn属性的值设置
     * @param value
     */
    setValue(value?: string): void;
    /**
     * 获取设计器的xml值
     */
    getValue(): string;
    getJson(): any;
    getOptions(): SolonFlowBpmnDesignerOptions;
    clear(): void;
    destroy(): void;
    changeLocal(lang: string): this;
    changeTheme(theme?: "dark" | "light"): this;
    toggleMinimap(): void;
    showPanel(): boolean;
    /**
     * bpmn自定义模块
     * @private
     */
    private additionalModules;
}

export declare type SolonFlowBpmnDesignerOptions = {
    /**
     * @description 挂载dom/id
     */
    container: string | HTMLElement;
    /**
     * @description 值类型
     * @defaultValue yaml
     */
    valueType?: 'bpmn' | 'json' | 'yaml';
    /**
     * @description 主题
     * @default light
     */
    theme?: 'dark' | 'light';
    /**
     * @description bpmn2.0 xml数据
     */
    value?: string;
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
     * @description 设计器高度(屏幕可视高度)
     * @default 60
     */
    height?: number;
    /**
     * @description 用户自定义拓展模块
     */
    additionalModels?: ModuleDeclaration[];
    /**
     * @description 设计器网格样式
     */
    gridLine?: {
        /**
         * @description 最小网格边长
         */
        smallGridSpacing: number;
        /**
         * @description 大号网格边长
         */
        gridSpacing: number;
        /**
         * @description 网格边框宽度
         */
        gridLineStroke: number;
        /**
         * @description 网格边框透明度
         */
        gridLineOpacity: number;
        /**
         * @description 网格边框颜色
         */
        gridLineColor: string;
    };
    minimap?: {
        open: boolean;
        position: {
            x: number;
            y: 'bottom' | number;
        };
    };
    /**
     * @description 自定义颜色组件
     */
    colors?: Color[];
    toolbarKeys?: CustomMenu[];
    toolbarExcludeKeys?: DefaultToolbarKey[];
    toolbarSize?: string | 'small' | 'medium' | 'large';
    /**
     * @description 监听选择节点变化
     * @param bpmnModeler
     */
    onSelect?: (element: Element_2) => void;
    /**
     * @description 监听设计器变化
     * @param bpmnModeler
     */
    onChange?: (callback: (valueType?: "json" | "yaml") => any) => void;
    /**
     * @description xml加载错误
     * @param error
     */
    onXmlError?: (error: Error | string) => void;
    /**
     * @description 实例创建完成
     * @param bpmnModeler
     */
    onCreated?: (modeler: Modeler) => void;
    /**
     * @description 销毁实例
     * @param bpmnModeler
     */
    onDestroy?: (designer: SolonFlowBpmnDesigner) => void;
} & Partial<Omit<BaseViewerOptions, "element">>;

export declare class SolonFlowBpmnViewer {
    /**
     * 设计器对象
     */
    private bpmnModeler;
    /**
     * easy-bpmn-designer设计器
     */
    private container;
    /**
     * 属性
     */
    options: SolonFlowBpmnViewerProps;
    /**
     * 设计器
     */
    private viewer;
    /**
     * 工具栏
     * @private
     */
    private toolbar;
    constructor(options: SolonFlowBpmnViewerProps);
    private initialize;
    getToolbar(): Instance<Props>;
    getViewer(): HTMLDivElement;
    getModeler(): Modeler;
    /**
     * 设置节点颜色
     * @param nodeIds 节点集合
     * @param colorClass {@link NodeColor} 样式
     */
    setNodeColor(nodeIds: string[], colorClass: Color_2): void;
    /**
     * 点击元素节点事件
     * @param element 节点
     * @private
     */
    private elementClick;
    /**
     * @description 销毁流程图实例
     */
    destroy(): void;
}

export declare type SolonFlowBpmnViewerProps = {
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
};

declare interface SolonFlowChina {
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

declare interface SolonFlowLink {
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

declare interface SolonFlowNode {
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

declare type Stateful = {
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
    activeColor: Color_2;
};

export declare const toBpmnXml: (json: SolonFlowChina, isColor?: boolean) => string;

export { }
