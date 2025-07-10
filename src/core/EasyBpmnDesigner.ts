import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import {isUndo, isRedo} from "diagram-js/lib/features/keyboard/KeyboardUtil";
import {event as domEvent} from "min-dom";
type ModuleDeclaration = import("didi").ModuleDeclaration;
import {Toolbar} from "../components/Toolbar.ts";
import {Panel} from "../components/Panel.ts";
import {en} from "../i18n/en.ts";
import {zh} from "../i18n/zh.ts";
import i18next, {Resource} from "i18next";

import "../styles/variable.css";
import "../styles/designer.css";
import "../styles/toolbar.css";
import "../styles/panel.css";
import "../styles/index.css";

import GridLineModule from "diagram-js-grid-bg";
import minimapModule from "diagram-js-minimap"; //小地图
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import BpmnColorPickerModule from "bpmn-js-color-picker"; // 颜色选择器
import "bpmn-js-color-picker/colors/color-picker.css";
import {EasyBpmnDesignerPalette} from "../modules/Palette";
import {EasyBpmnDesignerContextPad, EasyBpmnDesignerNodeContextPad} from "../modules/ContextPad";
import {EasyBpmnDesignerPopupMenu} from "../modules/PopupMenu";
import zhTranslate from "../modules/Translate";

// 标签解析 Moddle
import {defineCustomElement} from "../utils/domUtils.ts";
import {initModelerStr} from "../utils/bpmnUtils.ts";
import {EasyBpmnDesignerOptions} from "../types/easy-bpmn-designer.ts";
import {CommandStack, EventBus} from "bpmn-js";

defineCustomElement("easy-bpmn-designer-toolbar", Toolbar);
defineCustomElement("easy-bpmn-designer-panel", Panel);

export interface DesignerEventListener {
    onCreate: (modeler: BpmnModeler, options: EasyBpmnDesignerOptions) => void;
}

/**
 * @description 默认属性
 */
const defaultOptions: Partial<EasyBpmnDesignerOptions> = {
    lang: "zh",
    theme: "light",
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

export class EasyBpmnDesigner {
    /**
     * 设计器对象
     */
    bpmnModeler!: BpmnModeler;
    /**
     * easy-bpmn-designer设计器
     */
    container!: HTMLDivElement;
    /**
     * 属性
     */
    options: EasyBpmnDesignerOptions;
    /**
     * 顶部工具栏
     */
    toolbar!: Toolbar;
    /**
     * 设计器
     */
    designer!: HTMLDivElement;
    /**
     * 属性面板
     */
    panel!: Panel;

    eventComponents: DesignerEventListener[] = [];

    constructor(options: EasyBpmnDesignerOptions) {
        this.options = {...defaultOptions, ...options};
        this.initialize();
    }

    /**
     * 初始化
     * @private
     */
    private initialize() {
        const i18nConfig = this.options.i18n || {};
        const resources = {
            en: {translation: {...en, ...i18nConfig.en}},
            zh: {translation: {...zh, ...i18nConfig.zh}},
        } as Resource;
        for (let key of Object.keys(i18nConfig)) {
            if (key != "en" && key != "zh") {
                resources[key] = {
                    translation: {...i18nConfig[key]},
                };
            }
        }
        i18next.init({lng: this.options.lang, resources}, (_err, _t) => {
            this.innerBpmnModeler();
        });
    }

    protected innerBpmnModeler() {
        // 根据传递container属性获取父级传递的数据是否为id，如果是则转为dom
        const rootEl =
            typeof this.options.container === "string" ? (document.querySelector(this.options.container) as HTMLElement)
                : this.options.container;
        // 主题-白/黑
        rootEl.classList.add(`easy-bpmn-designer-theme-${this.options.theme}`);
        // 获取父级dom class
        this.container = rootEl.querySelector(".easy-bpmn-designer-container")!;
        // 如果没有就创建
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.classList.add("easy-bpmn-designer-container");
        }
        rootEl.appendChild(this.container);

        // 设计器
        this.designer = document.createElement("div");
        this.designer.classList.add("easy-bpmn-designer-container-designer");

        // 设计器内容
        const {
            height,
            gridLine,
            value,
            textRenderer,
            minimap,
            lightBpmnRenderer,
            darkBpmnRenderer,
        } = this.options;
        if ((height || 60) >= 60) {
            this.designer.classList.add("djs-palette-column");
        }
        this.bpmnModeler = new BpmnModeler({
            container: this.designer,
            height: `${height}vh`,
            additionalModules: this.additionalModules(),
            gridLine,
            bpmnRenderer: this.options.theme === "dark" ? darkBpmnRenderer : lightBpmnRenderer,
            textRenderer,
            minimap,
        });
        // 绑定快捷键
        this.setupKeyboard(this.designer);
        // 工具栏
        this.toolbar = new Toolbar();
        this.eventComponents.push(this.toolbar);
        // 属性面板
        this.panel = new Panel();
        this.eventComponents.push(this.panel);
        // 导入xml
        const xml = initModelerStr();
        this.bpmnModeler
            .importXML(value || xml)
            .then(({warnings}) => {
                if (warnings && warnings.length) {
                    warnings.forEach((warn) => console.warn(warn));
                }
                this.onCreated();
                // 添加监听事件
                this.addListenerEvent();
            })
            .catch((err) => {
                console.log(err);
                this.options.onXmlError?.(err);
            });
    }

    protected onCreated() {
        this.eventComponents.forEach((zEvent) => {
            zEvent.onCreate && zEvent.onCreate(this.bpmnModeler, this.options);
        });

        const _header =
            this.container.querySelector(".easy-bpmn-designer-container-toolbar") ||
            this.container;
        _header.appendChild(this.toolbar);

        const _main =
            this.container.querySelector(".easy-bpmn-designer-container-designer") ||
            this.container;
        _main.appendChild(this.designer);

        const _footer =
            this.container.querySelector(".easy-bpmn-designer-container-panel") ||
            this.container;
        _footer.appendChild(this.panel);

        if (this.options.onCreated) {
            this.options.onCreated(this);
        }
    }

    setupKeyboard(designer: HTMLDivElement) {
        const eventBus = this.bpmnModeler.get("eventBus") as EventBus;
        const commandStack = this.bpmnModeler.get("commandStack") as CommandStack;
        const cancel = (event: any) => {
            event.preventDefault();
            event.stopPropagation();
        };
        const handleKeys = (event: any) => {
            if (isUndo(event)) {
                commandStack.undo();
                return cancel(event);
            }
            if (isRedo(event)) {
                commandStack.redo();
                return cancel(event);
            }
        };

        eventBus.on("keyboard.bind", function () {
            domEvent.bind(designer, "keydown", handleKeys);
        });

        eventBus.on("keyboard.unbind", function () {
            domEvent.unbind(designer, "keydown", handleKeys);
        });
    }

    addListenerEvent() {
        const eventBus = this.bpmnModeler.get("eventBus") as EventBus;
        // 监听 shape.added 事件
        eventBus.on("shape.added", function (event: any) {
            console.debug("监听新增节点事件", event);
        });
    }

    /**
     * 获取设计器的xml值
     */
    async getValue() {
        const {xml} = await this.bpmnModeler.saveXML();
        return xml;
    }

    async getJson() {
        // @ts-ignore
        const elements = this.bpmnModeler.get("elementRegistry").getAll();
        const processData = elements.reduce((acc: any, element: any) => {
            if (element.type !== "label") {
                acc[element.id] = {
                    type: element.type,
                    ...element.businessObject,
                };
            }
            return acc;
        }, {});
        return JSON.stringify(processData, null, 2);
    }

    getOptions() {
        return this.options;
    }

    clear() {
        this.bpmnModeler.clear();
    }

    destroy() {
        this.options.onDestroy?.(this);
        this.bpmnModeler.destroy();
        this.toolbar?.remove();
        this.designer.remove();
        this.panel?.remove();
    }

    changeLocal(lang: string) {
        this.destroy();
        this.options.lang = lang;
        i18next.changeLanguage(lang);
        this.initialize();
        return this;
    }

    changeTheme(theme?: "dark" | "light") {
        const rootEl =
            typeof this.options.container === "string" ? (document.querySelector(this.options.container) as HTMLElement)
                : this.options.container;
        if (!theme) {
            theme = this.options.theme === "dark" ? "light" : "dark";
        }
        this.destroy();
        rootEl.classList.remove(`easy-bpmn-designer-theme-${this.options.theme}`);
        rootEl.classList.add(`easy-bpmn-designer-theme-${theme}`);
        this.options.theme = theme;
        this.initialize();
        return this;
    }

    toggleMinimap() {
        if (!this.bpmnModeler) return;
        const minimap = this.bpmnModeler.get("minimap");
        // @ts-ignore
        minimap.toggle();
    }

    /**
     * bpmn自定义模块
     * @private
     */
    private additionalModules() {
        const Modules: ModuleDeclaration[] = [
            EasyBpmnDesignerPalette,
            EasyBpmnDesignerContextPad,
            EasyBpmnDesignerNodeContextPad,
            EasyBpmnDesignerPopupMenu,
            minimapModule,
            GridLineModule,
            BpmnColorPickerModule,
        ];
        // 汉化
        if (this.options.lang === "zh") {
            Modules.push(zhTranslate);
        }
        // 插入用户自定义扩展模块
        if (
            Object.prototype.toString.call(this.options.additionalModel) ===
            "[object Array]"
        ) {
            Modules.push(...this.options.additionalModel);
        } else {
            this.options.additionalModel &&
            Modules.concat(this.options.additionalModel);
        }

        return Modules;
    }

}
