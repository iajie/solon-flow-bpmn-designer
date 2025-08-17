import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { isType } from "../../utils/bpmnUtils.ts";
import {
    Injector, EventBus, ContextPad, Modeling, Connect, Canvas, ContextPadConfig, ElementFactory,
    Create, PopupMenu, Rules, Translate, Element, Shape, AppendPreview
} from 'bpmn-js';

export class EasyBpmnNodeContextPadProvider extends ContextPadProvider {
    private elementFactory: ElementFactory;
    private readonly autoPlace: any;
    private create: Create;
    private appendPreview: AppendPreview;
    private readonly translate: Translate;
    private modeling: Modeling;
    private rules: Rules;
    private popupMenu: PopupMenu;
    private connect: Connect;
    private canvas: Canvas;

    constructor(config: ContextPadConfig, injector: Injector, eventBus: EventBus, contextPad: ContextPad,
                modeling: Modeling, elementFactory: ElementFactory, connect: Connect, create: Create, popupMenu: PopupMenu,
                canvas: Canvas, rules: Rules, translate: Translate, appendPreview: AppendPreview) {
        super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu,
            canvas, rules, translate, appendPreview);
        this.elementFactory = elementFactory;
        this.create = create;
        this.appendPreview = appendPreview;
        this.translate = translate;
        this.autoPlace = injector.get("autoPlace", false);
        this.modeling = modeling;
        this.rules = rules;
        this.popupMenu = popupMenu;
        this.connect = connect;
        this.canvas = canvas;
    }

    isDeleteAllowed(elements: Element[]) {
        const baseAllowed = this.rules.allowed('elements.delete', {
            elements: elements
        });
        if (baseAllowed && Array.isArray(baseAllowed)) {
            elements.every(item => baseAllowed.includes(item));
        }
        return baseAllowed;
    }

    getContextPadEntries(element: Element) {
        if (!element) return {};
        const actions: Record<string, any> = {};
        const removeElement = (_: any, element: Element) => {
            this.modeling.removeElements([element]);
        }
        const deleteAction = () => {
            return {
                'delete': {
                    group: 'edit',
                    className: 'bpmn-icon-trash',
                    title: this.translate('Delete'),
                    action: {
                        click: removeElement
                    }
                }
            };
        }
        if (element.type === 'label') {
            if (this.isDeleteAllowed([element])) {
                Object.assign(actions, deleteAction());
            }
            return actions;
        }
        const startConnect = (event: MouseEvent, element: Element) => {
            this.connect.start(event, element);
        }

        const getReplaceMenuPosition = (_: Element) => {
            const Y_OFFSET = 5;
            const pad = this.canvas.getContainer().querySelector('.djs-context-pad')!;
            const padRect = pad.getBoundingClientRect();
            return {
                x: padRect.left,
                y: padRect.bottom + Y_OFFSET
            };
        }

        if (!isType(element.type, ['bpmn:EndEvent', "bpmn:SequenceFlow", "bpmn:StartEvent", "bpmn:TextAnnotation", "bpmn:Association"])) {
            Object.assign(actions, {
                'append.end-event': this.appendAction('bpmn:EndEvent', 'bpmn-icon-end-event-none', 'Append end event'),
            });
        }
        if (!isType(element.type, ["bpmn:EndEvent", "bpmn:SequenceFlow", "bpmn:TextAnnotation", "bpmn:Association"])) {
            Object.assign(actions, {
                'append.gateway': this.appendAction('bpmn:ExclusiveGateway', 'bpmn-icon-gateway-none', 'Append gateway'),
            });
        }
        if (!this.popupMenu.isEmpty(element, 'bpmn-replace')) {
            // Replace menu entry
            Object.assign(actions, {
                'replace': {
                    group: 'edit',
                    className: 'bpmn-icon-screw-wrench',
                    title: this.translate('Change element'),
                    action: {
                        click: (event: MouseEvent, element: Element) => {
                            const position = Object.assign(getReplaceMenuPosition(element), {
                                cursor: {x: event.x, y: event.y}
                            });
                            this.popupMenu.open(element, 'bpmn-replace', position, {
                                title: this.translate('Change element'),
                                width: 300,
                                search: true
                            });
                        }
                    }
                }
            });
        }

        if (isType(element.type, ['bpmn:TextAnnotation', "bpmn:EventBasedGateway", "bpmn:UserTask"])) {
            Object.assign(actions, {
                'connect': {
                    group: 'edit',
                    className: 'bpmn-icon-connection-multi',
                    title: this.translate('Connect using association'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect,
                    },
                },
            });
        } else if (!isType(element.type, ["bpmn:Association"])) {
            // Object.assign(actions, {
            //     'append.text-annotation': this.appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation', 'Add text annotation')
            // });
        }

        if (this.isDeleteAllowed([element])) {
            Object.assign(actions, deleteAction());
        }

        return actions;
    }

    appendAction(type: string, className: string, title: string, options?: any) {
        const appendStart = (event: any, element: Shape) => {
            const shape = this.elementFactory.createShape(Object.assign({type: type}, options));
            this.create.start(event, shape, {
                source: element
            });
        }
        const append = this.autoPlace ? (_: any, element: Shape) => {
            const shape = this.elementFactory.createShape(Object.assign({type: type}, options));
            this.autoPlace.append(element, shape);
        } : appendStart;

        const previewAppend = this.autoPlace ? (_: any, element: Shape) => {
            // mouseover
            this.appendPreview.create(element, type, options);
            return () => {
                // mouseout
                this.appendPreview.cleanUp();
            };
        } : null;
        return {
            group: 'model',
            className: className,
            title: this.translate(title),
            action: {
                dragstart: appendStart,
                click: append,
                hover: previewAppend
            }
        };
    }
}
