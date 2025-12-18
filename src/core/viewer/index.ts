import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "../../styles/index.css";
import "../../styles/viewer.css";
import { en } from "../../i18n/en.ts";
import { zh } from "../../i18n/zh.ts";
import i18next, { Resource } from "i18next";
import { SolonFlowBpmnViewerProps, defaultViewerOptions, Color, NodeColor, Stateful } from "./props";
import { SolonModdle } from "../../modules";
import { EventBus, Element, Modeling, Canvas, ElementRegistry, Modeler } from "bpmn-js";
import { importStr, initModelerStr } from "../../utils/bpmnUtils.ts";
import jsyaml from "js-yaml";
import { SolonFlowChina } from "../../types/easy-bpmn-designer.ts";
import tippy from "tippy.js";

export class SolonFlowBpmnViewer {
    /**
     * 设计器对象
     */
    private bpmnModeler!: BpmnModeler;
    /**
     * easy-bpmn-designer设计器
     */
    private container!: HTMLDivElement;
    /**
     * 属性
     */
    options: SolonFlowBpmnViewerProps;
    /**
     * 设计器
     */
    private viewer!: HTMLDivElement;

    constructor(options: SolonFlowBpmnViewerProps) {
        this.options = { ...defaultViewerOptions, ...options };
        this.initialize();
    }

    /**
     * 初始化
     * @private
     */
    private initialize() {
        const i18nConfig = this.options.i18n || {};
        const resources = {
            en: { translation: { ...en, ...i18nConfig.en } },
            zh: { translation: { ...zh, ...i18nConfig.zh } },
        } as Resource;
        for (let key of Object.keys(i18nConfig)) {
            if (key != "en" && key != "zh") {
                resources[key] = {
                    translation: { ...i18nConfig[key] },
                };
            }
        }
        i18next.init({ lng: this.options.lang, resources }, () => {
            this.initViewer()
        });
    }

    private initViewer() {
        // 根据传递container属性获取父级传递的数据是否为id，如果是则转为dom
        const rootEl =
            typeof this.options.container === "string" ? (document.querySelector(this.options.container) as HTMLElement)
                : this.options.container;
        // 主题-白/黑
        rootEl.classList.add(`easy-bpmn-designer-theme-${ this.options.theme }`);
        // 获取父级dom class
        this.container = document.createElement("div");
        this.container.classList.add("easy-bpmn-designer-container");
        rootEl.appendChild(this.container);

        // 设计器
        this.viewer = document.createElement("div");
        this.viewer.classList.add("easy-bpmn-designer-container-designer");
        // 设计器内容
        const { height, value, active, mode } = this.options;
        this.bpmnModeler = new BpmnModeler({
            container: this.viewer,
            height: `${ height }vh`,
            moddleExtensions: {
                solon: SolonModdle
            },
            additionalModules: [{
                paletteProvider: ['value', ''],
                // 禁止拖动线
                bendpoints: ['value', ''],
                // 禁止点击节点出现contextPad
                contextPadProvider: ['value'],
                // 禁止双击节点出现label编辑框
                labelEditingProvider: ['value', ''],
                // 禁止拖动节点
                move: ['value', '']
            }],
            bpmnRenderer: mode === 'read' ? {
                defaultLabelColor: "#000",
                defaultFillColor: '#eef4ff',
                defaultStrokeColor: '#349afa'
            } : {},
            textRenderer: {
                defaultStyle: {
                    fontFamily: '"Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"',
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "20px",
                }
            }
            // bpmnRenderer: this.options.theme === "dark" ? darkBpmnRenderer : lightBpmnRenderer,
        });
        let data, stateful: Stateful[] = [];
        if (typeof value !== 'string') {
            data = value.data;
            stateful = value?.stateful || [];
        } else {
            data = value;
            // @ts-ignore
            const yaml: SolonFlowChina = jsyaml.load(data);
            if (mode === "active" && active && active.length) {
                const state = yaml.stateful;
                if (state) {
                    for (let stateKey in state) {
                        const ful = active.find(ful => ful.stateType.toLowerCase() === String(state[stateKey]).toLowerCase());
                        if (ful) {
                            ful.activeNodeIds = [stateKey];
                            stateful.push(ful);
                        }
                    }
                } else {
                    stateful = active;
                }
            }
        }
        // 装载xml
        this.bpmnModeler.importXML(initModelerStr()).then(() => {
            if (this.options.onClick) {
                // 点击事件
                const eventBus: EventBus = this.bpmnModeler.get('eventBus');
                // 加载后绑定监听
                eventBus.on('element.click', ({ element }: { element: Element }) => this.elementClick(element));
            }
            importStr(data, this.bpmnModeler as Modeler);
            // 加载完成，加载节点样式
            if (mode === 'active' && stateful.length) {
                stateful.forEach(ful => {
                    ful.activeNodeIds && this.setNodeColor(ful.activeNodeIds, ful.activeColor);
                });
            }
        }).catch((err) => console.log("import xml error: ", err));

        this.container.appendChild(this.viewer);
    }

    /**
     * 设置节点颜色
     * @param nodeIds 节点集合
     * @param colorClass {@link NodeColor} 样式
     */
    private setNodeColor(nodeIds: string[], colorClass: Color){
        if (nodeIds && nodeIds.length) {
            const elementRegistry: ElementRegistry = this.bpmnModeler.get('elementRegistry');
            const modeling: Modeling = this.bpmnModeler.get('modeling');
            const canvas: Canvas = this.bpmnModeler.get('canvas');
            nodeIds.forEach(id => {
                const element = elementRegistry.get(id) as Element;
                if (element.type.endsWith('SequenceFlow')) {
                    setTimeout(() => {
                        modeling.setColor([element], NodeColor[colorClass]);
                    }, 10);
                } else {
                    setTimeout(() => {
                        if (!canvas.hasMarker(id, colorClass)) {
                            canvas.addMarker(id, colorClass);
                        }
                    }, 10);
                }
                if (element.incoming && element.incoming.length) {
                    for (let out of element.incoming) {
                        setTimeout(() => {
                            canvas.addMarker(out.id, colorClass);
                        }, 10);
                    }
                }
            });
        }
    }

    /**
     * 点击元素节点事件
     * @param element 节点
     * @private
     */
    private elementClick(element: Element) {
        let excludes = false;
        if (this.options.excludeType) {
            excludes = this.options.excludeType.some(item => element.businessObject.$type.endsWith(item));
        }
        if (!element.businessObject.$type.endsWith('Process') && !excludes) {
            // 判断是否是异步方法
            this.options.onClick?.(element.businessObject).then((res) => {
                const canvas: Canvas = this.bpmnModeler.get('canvas');
                const graphics = canvas.getGraphics(element.id);
                if (this.options.popoverRender) {
                    const popover = this.options.popoverRender(res);
                    const tip = tippy(graphics, {
                        appendTo: this.viewer,
                        content: popover,
                        arrow: true, // 是否显示方向指示
                        interactive: true, // 是否点击其他地方关闭
                        theme: 'easy-bpmn-viewer-tip',
                        placement: 'top',
                        trigger: 'click'
                    });
                    // 点击就显示
                    tip.show();
                }
            });
        }
    }
}
