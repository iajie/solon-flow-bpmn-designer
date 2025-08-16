import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer';
import { BpmnElement } from 'bpmn-js';
import { default as default_2 } from 'bpmn-js/lib/Modeler';
import { Element as Element_2 } from 'bpmn-js';
import { Modeler } from 'bpmn-js';
import { ModuleDeclaration } from 'bpmn-js';

declare class AbstractPanel extends HTMLElement implements DesignerEventListener {
    template: string;
    modeler?: Modeler;
    options?: SolonFlowBpmnDesignerOptions;
    originalElement?: BpmnElement;
    element?: BpmnElement & any;
    protected constructor();
    protected registerClickListener(): void;
    connectedCallback(): void;
    onClick(): void;
    onChange(element: BpmnElement): void;
    updateElement(element: BpmnElement, oldProperties: any, properties: any): void;
    onCreate(modeler: Modeler, options: SolonFlowBpmnDesignerOptions): void;
    /**
     * 修改节点
     * @param e
     */
    elementChanged(e: any): void;
    handleSelectionChange(e: {
        newSelection: BpmnElement[];
    }, modeler: Modeler): void;
}

declare class AbstractToolBar extends HTMLElement implements DesignerEventListener {
    template: string;
    modeler?: Modeler;
    options?: SolonFlowBpmnDesignerOptions;
    protected constructor();
    protected registerClickListener(): void;
    connectedCallback(): void;
    onClick(): void;
    onCreate(modeler: Modeler, options: SolonFlowBpmnDesignerOptions): void;
}

declare interface CustomMenu {
    id?: string;
    className?: string;
    icon?: string;
    html?: string;
    tip?: string;
    onClick?: (event: MouseEvent, modeler: Modeler) => void;
    onCreate?: (button: HTMLElement, modeler: Modeler) => void;
}

declare type DefaultToolbarKey = (typeof defaultToolbarKeys)[number];

declare const defaultToolbarKeys: string[];

declare interface DesignerEventListener {
    onCreate: (modeler: Modeler, options: SolonFlowBpmnDesignerOptions) => void;
}

declare interface MenuGroup {
    title?: string;
    icon?: string;
    toolbarKeys: (string | CustomMenu | MenuGroup)[];
}

declare class Panel extends HTMLElement implements DesignerEventListener {
    panelDom: AbstractPanel[];
    constructor();
    connectedCallback(): void;
    onCreate(modeler: Modeler, options: SolonFlowBpmnDesignerOptions): void;
}

export declare class SolonFlowBpmnDesigner {
    /**
     * 设计器对象
     */
    bpmnModeler: default_2;
    /**
     * easy-bpmn-designer设计器
     */
    container: HTMLDivElement;
    /**
     * 属性
     */
    options: SolonFlowBpmnDesignerOptions;
    /**
     * 顶部工具栏
     */
    toolbar: Toolbar;
    /**
     * 设计器
     */
    designer: HTMLDivElement;
    /**
     * 属性面板
     */
    panel: Panel;
    eventComponents: DesignerEventListener[];
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
     * @description 是否绑定快捷键
     * @default true
     */
    keyboard?: boolean;
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
    toolbarKeys?: (string | CustomMenu | MenuGroup)[];
    toolbarExcludeKeys?: DefaultToolbarKey[];
    toolbarSize?: string | 'small' | 'medium' | 'large';
    panelTabs?: {
        /**
         * @description tabs item项标题
         */
        title: string;
        key: string;
        hideIn?: boolean | (() => boolean);
        /**
         * 风琴组
         */
        group: {
            /**
             * 组标题
             */
            title: string;
            items: {
                label: string;
                /**
                 * input类型
                 */
                type?: string | 'text' | 'password' | 'radio' | 'checkbox' | 'button' | 'image' | 'file' | 'email' | 'url' | 'tel' | 'search' | 'color' | 'number' | 'date' | 'month' | 'week';
                /**
                 * 内容
                 */
                html?: string;
            }[];
            [key: string]: any;
        }[];
    }[];
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

declare class Toolbar extends HTMLElement implements DesignerEventListener {
    toolbars: AbstractToolBar[];
    constructor();
    connectedCallback(): void;
    onCreate(modeler: Modeler, options: SolonFlowBpmnDesignerOptions): void;
}

export { }
