import { Element, BpmnRendererConfig, Modeling, PopupMenu, Translate } from "bpmn-js";

export interface Color {
    label: string;
    fill?: string;
    stroke?: string;
}

export class EasyBpmnColorPopupMenuProvider {

    private modeling: Modeling;
    private popupMenu: PopupMenu;
    private readonly translate: Translate;
    private colors: Color[] = [{
        label: 'Default',
        fill: undefined,
        stroke: undefined
    }, {
        label: 'Blue',
        fill: '#BBDEFB',
        stroke: '#0D4372'
    }, {
        label: 'Orange',
        fill: '#FFE0B2',
        stroke: '#6B3C00'
    }, {
        label: 'Green',
        fill: '#C8E6C9',
        stroke: '#205022'
    }, {
        label: 'Red',
        fill: '#FFCDD2',
        stroke: '#831311'
    }, {
        label: 'Purple',
        fill: '#E1BEE7',
        stroke: '#5B176D'
    }];
    private readonly defaultFillColor: string;
    private readonly defaultStrokeColor: string;

    static $inject = [
        'config.colorPicker',
        'config.bpmnRenderer',
        'popupMenu',
        'modeling',
        'translate'
    ];

    constructor(config: { colors: Color[] }, bpmnRendererConfig: BpmnRendererConfig, popupMenu: PopupMenu,
                modeling: Modeling, translate: Translate) {
        console.log(config);
        this.modeling = modeling;
        this.popupMenu = popupMenu;
        this.translate = translate;
        if (config && config.colors) {
            this.colors = config.colors;
        }
        this.defaultFillColor = bpmnRendererConfig.defaultFillColor || "white";
        this.defaultStrokeColor = bpmnRendererConfig.defaultStrokeColor || "rgb(34, 36, 42)";
        // @ts-ignore
        this.popupMenu.registerProvider("color-picker", this);
    }

    getEntries(elements: Element[]) {
        const entries: { [key: string]: any} = {};
        const colorIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="100%" width="100%">
              <rect rx="2" x="1" y="1" width="22" height="22" fill="var(--fill-color)" stroke="var(--stroke-color)" style="stroke-width:2"></rect>
        </svg>`;
        this.colors.forEach((color) => {
            entries[color.label] = {
                title: this.translate(color.label),
                id: color.label.toLowerCase() + '-color',
                imageHtml: colorIconHtml.replace('var(--fill-color)', color.fill || this.defaultFillColor)
                    .replace('var(--stroke-color)', color.stroke || this.defaultStrokeColor),
                action: () => {
                    if (elements.length > 0) {
                        elements.forEach(element => {
                            this.modeling.setColor([element], color);
                        })
                    } else {
                        this.modeling.setColor(elements, color);
                    }
                }
            }
        });
        return entries;
    }

}
