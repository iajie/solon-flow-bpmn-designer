import {BaseViewerOptions, ModdleExtensions} from "bpmn-js/lib/BaseViewer";
import {EasyBpmnDesigner} from "../core/EasyBpmnDesigner.ts";
import {DefaultToolbarKey} from "../components/toolbar/DefaultToolbarKeys.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
type ModuleDeclaration = import("didi").ModuleDeclaration;

export interface CustomMenu {
    id?: string
    className?: string
    icon?: string
    html?: string
    tip?: string
    onClick?: (event: MouseEvent, modeler: BpmnModeler) => void
    onCreate?: (button: HTMLElement, modeler: BpmnModeler) => void
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
     * @description 用户自定义解析
     */
    moddleExtension?: ModdleExtensions;
    /**
     * @description 流程类型设置扩展元素构建模块
     * @default flowable
     */
    prefix?: string | 'camunda' | 'flowable' | 'activiti';
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
    tokenSimulation?: {
        active: boolean;
    };
    toolbarKeys?: (string | CustomMenu | MenuGroup)[],
    toolbarExcludeKeys?: DefaultToolbarKey[];
    toolbarSize: string | 'small' | 'medium' | 'large';
    /**
     * @description 监听选择节点变化
     * @param bpmnModeler
     */
    onSelect?: (designer: EasyBpmnDesigner) => void;
    /**
     * @description 监听设计器变化
     * @param bpmnModeler
     */
    onChange?: (designer: EasyBpmnDesigner) => void;
    /**
     * @description xml加载错误
     * @param error
     */
    onXmlError?: (error: Error) => void;
    /**
     * @description 实例创建完成
     * @param bpmnModeler
     */
    onCreated?: (designer: EasyBpmnDesigner) => void;
    /**
     * @description 销毁实例
     * @param bpmnModeler
     */
    onDestroy?: (designer: EasyBpmnDesigner) => void;
} & Partial<Omit<BaseViewerOptions, "element">>
