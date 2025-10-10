import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer';
import { Element as Element_2 } from 'bpmn-js';
import { Modeler } from 'bpmn-js';
import { ModuleDeclaration } from 'bpmn-js';

declare interface Color {
    label: string;
    fill?: string;
    stroke?: string;
}

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
    container: string | Element_2;
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
    bpmn: Record<string, any>;
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

export declare const toBpmnXml: (json: SolonFlowChina) => string;

export { }
