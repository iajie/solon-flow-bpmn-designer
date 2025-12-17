import { Color } from "../../../modules/PopupMenu/Color.ts";
import { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";
import { CustomMenu } from "../../../types/easy-bpmn-designer.ts";
import { Modeler, ModuleDeclaration, Element } from "bpmn-js";
import { SolonFlowBpmnDesigner } from "../index.ts";
import { DefaultToolbarKey } from "../../../components/menus";

export type SolonFlowBpmnDesignerOptions = {
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
    },
    minimap?: {
        open: boolean;
        position: { x: number; y: 'bottom' | number },
    };
    /**
     * @description 自定义颜色组件
     */
    colors?: Color[];
    toolbarKeys?: CustomMenu[],
    toolbarExcludeKeys?: DefaultToolbarKey[];
    toolbarSize?: string | 'small' | 'medium' | 'large';
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

/**
 * @description 默认属性
 */
export const defaultOptions: Partial<SolonFlowBpmnDesignerOptions> = {
    lang: "zh",
    theme: "light",
    valueType: 'yaml',
    height: 70,
    gridLine: {
        smallGridSpacing: 20,
        gridSpacing: 80,
        gridLineStroke: 0.5,
        gridLineOpacity: 0.6,
        gridLineColor: "#ccc",
    },
    lightBpmnRenderer: {
        defaultLabelColor: "#000",
        defaultFillColor: "#eef4ff",
        defaultStrokeColor: "#349afa",
    },
    darkBpmnRenderer: {
        defaultLabelColor: "#eef4ff",
        defaultFillColor: "hsl(225, 10%, 15%)",
        defaultStrokeColor: "#349afa",
    },
    textRenderer: {
        defaultStyle: {
            fontFamily: '"Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"',
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
        },
    },
    minimap: {
        open: false,
        position: {
            x: 20,
            y: "bottom",
        },
    },
};
