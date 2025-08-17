import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import {
    AppendPreview, Connect, ContextPad, ContextPadConfig, Create, ElementFactory, EventBus,
    Injector, Modeling, PopupMenu, Rules, Canvas, Translate, Element
} from "bpmn-js";

export class EasyBpmnColorContextPadProvider extends ContextPadProvider {

    private popupMenu: PopupMenu;
    private canvas: Canvas;
    private readonly translate: Translate;
    constructor(config: ContextPadConfig, injector: Injector, eventBus: EventBus, contextPad: ContextPad,
                modeling: Modeling, elementFactory: ElementFactory, connect: Connect, create: Create,
                popupMenu: PopupMenu, canvas: Canvas, rules: Rules, translate: Translate, appendPreview: AppendPreview) {
        super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules,
            translate, appendPreview);
        this.canvas = canvas;
        this.popupMenu = popupMenu;
        this.translate = translate;
    }

    // @ts-ignore 单个元素pad菜单
    getContextPadEntries() {
        return this.createPopupAction();
    }

    // @ts-ignore 多个元素pad菜单，批量设置元素颜色
    getMultiElementContextPadEntries() {
        return this.createPopupAction();
    }

    createPopupAction () {
        const getStartPosition = () => {
            const Y_OFFSET = 5;
            const pad = this.canvas.getContainer().querySelector('.djs-context-pad')!;
            const padRect = pad.getBoundingClientRect();
            return {
                x: padRect.left,
                y: padRect.bottom + Y_OFFSET
            };
        }

        return {
            'set-color': {
                group: 'edit',
                className: 'bpmn-icon-color',
                title: this.translate('Set color'),
                html: `<div class="entry">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor">
                                <path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" />
                            </svg>
                        </div>`,
                action: {
                    click: (event: MouseEvent, element: Element) => {
                        // get start popup draw start position
                        const position = {
                            ...getStartPosition(),
                            cursor: {
                                x: event.x,
                                y: event.y
                            }
                        };
                        this.popupMenu.open(element, 'color-picker', position);
                    }
                }
            }
        };

    }

}
