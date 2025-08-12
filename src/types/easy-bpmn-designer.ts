import { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";
import { SolonFlowBpmnDesigner } from "../core/EasyBpmnDesigner.ts";
import {DefaultToolbarKey} from "../components/toolbar/DefaultToolbarKeys.ts";
import {Modeler, Element, ModuleDeclaration } from "bpmn-js";

export interface CustomMenu {
    id?: string
    className?: string
    icon?: string
    html?: string
    tip?: string
    onClick?: (event: MouseEvent, modeler: Modeler) => void
    onCreate?: (button: HTMLElement, modeler: Modeler) => void
}

export interface MenuGroup {
    title?: string,
    icon?: string,
    toolbarKeys: (string | CustomMenu | MenuGroup)[],
}

export type EasyBpmnDesignerOptions = {
    /**
     * @description 挂载dom/id
     */
    container: string | Element;
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
    },
    minimap?: {
        open: boolean;
        position: { x: number; y: 'bottom' | number },
    };
    toolbarKeys?: (string | CustomMenu | MenuGroup)[],
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
                type?: string | 'text' | 'password' | 'radio' | 'checkbox' | 'button' |
                    'image' | 'file' | 'email' | 'url' | 'tel' | 'search' | 'color' | 'number' | 'date' | 'month' | 'week';
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
    onSelect?: (element: Element) => void;
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
} & Partial<Omit<BaseViewerOptions, "element">>

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
    meta?: string;
    /**
     * @description 子节点
     */
    layout: SolonFlowNode[];
    /**
     * @description 存储bpmn节点样式位置等信息
     */
    bpmn: Record<string, any>;
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
    meta: Record<string, any>;
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
