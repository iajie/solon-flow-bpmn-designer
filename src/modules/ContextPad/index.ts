import ContextPadProvider, {
    Canvas,
    ContextPadConfig,
} from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { Injector, EventBus, ContextPad, Modeling, ElementFactory, AppendPreview, Connect, Create, PopupMenu,
    Rules, Translate, Element, Shape
} from 'bpmn-js';
import {EasyBpmnNodeContextPadProvider} from './Node.ts';
import {isType} from "../../utils/bpmnUtils.ts";

class EasyBpmnContextPadProvider extends ContextPadProvider {
    private elementFactory: ElementFactory;
    private readonly autoPlace: any;
    private create: Create;
    private appendPreview: AppendPreview;
    private readonly translate: Translate;

    constructor(config: ContextPadConfig, injector: Injector, eventBus: EventBus, contextPad: ContextPad,
        modeling: Modeling, elementFactory: ElementFactory, connect: Connect, create: Create, popupMenu: PopupMenu,
        canvas: Canvas, rules: Rules, translate: Translate, appendPreview: AppendPreview) {
        super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu,
            canvas, rules, translate, appendPreview);
        this.elementFactory = elementFactory;
        this.elementFactory = elementFactory;
        this.create = create;
        this.appendPreview = appendPreview;
        this.translate = translate;
        this.autoPlace = injector.get("autoPlace", false);
    }

    getContextPadEntries(element: Element) {
        if (!element) return {};
        const actions: Record<string, any> = {};
        const appendUserTask = (event: Event, element: Shape) => {
            const shape = this.elementFactory.createShape(
                Object.assign({type: "bpmn:UserTask"})
            );
            this.create.start(event, shape, {
                source: element,
            });
        };

        const append = this.autoPlace ? (_: any, element: Shape) => {
                const shape = this.elementFactory.createShape(
                    Object.assign({type: "bpmn:UserTask"})
                );
                this.autoPlace.append(element, shape);
            }
            : appendUserTask;

        const previewAppend = this.autoPlace ? (_: any, element: Shape) => {
                // mouseover
                this.appendPreview.create(element, "bpmn:UserTask", {});
                return () => {
                    // mouseout
                    this.appendPreview.cleanUp();
                };
            }
            : null;
        if (!isType(element.type, ["bpmn:EndEvent", "bpmn:SequenceFlow", "bpmn:TextAnnotation", "bpmn:Association", "label"])) {
            // 添加创建用户任务按钮
            actions["append.append-task"] = {
                group: "model",
                className: "bpmn-icon-user-task",
                title: this.translate("Append user task"),
                action: {
                    dragstart: appendUserTask,
                    click: append,
                    hover: previewAppend,
                },
            };
        }
        return actions;
    }
}

export const EasyBpmnDesignerContextPad = {
    __init__: ["enhancementContextPadProvider"],
    enhancementContextPadProvider: ["type", EasyBpmnContextPadProvider],
};

export const EasyBpmnDesignerNodeContextPad = {
    __init__: ["contextPadProvider"],
    contextPadProvider: ["type", EasyBpmnNodeContextPadProvider],
};
