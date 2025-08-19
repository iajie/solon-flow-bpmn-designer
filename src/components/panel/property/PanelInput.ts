import { AbstractPanel } from "../AbstractPanel.ts";
import {BpmnElement, Modeler} from "bpmn-js";
import { t } from "i18next";
import tippy from "tippy.js";
import { SolonFlowBpmnDesigner } from "../../../core/EasyBpmnDesigner.ts";

export class PanelInput extends AbstractPanel {

    type!: string;
    inputLabel!: string;
    inputLabelTip!: string | Element;
    labelElement!: AbstractPanel;
    inputElement!: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    className!: string;
    customElement!: HTMLDivElement;
    show: boolean = true;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add('property-item');
        const label = document.createElement('label');
        let text = t(this.inputLabel);
        if (this.inputLabelTip) {
            text = text +
            '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M761.6 115.2C900.266667 200.533333 981.333333 349.866667 981.333333 512c0 81.066667-21.333333 162.133333-61.866666 232.533333C836.266667 891.733333 680.533333 981.333333 512 981.333333 253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667c89.6 0 174.933333 25.6 249.6 72.533333z m83.2 586.666667c34.133333-57.6 51.2-123.733333 51.2-189.866667 0-132.266667-66.133333-253.866667-179.2-324.266667C654.933333 149.333333 584.533333 128 512 128 300.8 128 128 300.8 128 512s172.8 384 384 384c138.666667 0 264.533333-74.666667 332.8-194.133333z"></path><path d="M512 682.666667c-23.466667 0-42.666667 19.2-42.666667 42.666666s19.2 42.666667 42.666667 42.666667 42.666667-19.2 42.666667-42.666667-19.2-42.666667-42.666667-42.666666M512 256c-83.2 0-149.333333 66.133333-149.333333 149.333333 0 23.466667 19.2 42.666667 42.666666 42.666667s42.666667-19.2 42.666667-42.666667c0-36.266667 27.733333-64 64-64 17.066667 0 32 6.4 44.8 19.2 12.8 12.8 19.2 27.733333 19.2 44.8 0 21.333333-10.666667 42.666667-29.866667 53.333334-46.933333 32-76.8 81.066667-76.8 134.4v4.266666c0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666667-42.666667v-4.266666c0-23.466667 12.8-46.933333 36.266666-61.866667 42.666667-27.733333 70.4-74.666667 70.4-125.866667 0-38.4-14.933333-76.8-44.8-104.533333-27.733333-29.866667-66.133333-44.8-104.533333-44.8"></path></svg>'
        }
        label.innerHTML = text;
        if (this.inputLabelTip) {
            tippy(label, {
                appendTo: document.querySelector('.easy-bpmn-designer-container-panel')!,
                content: this.inputLabelTip,
                arrow: false, // 是否显示方向指示
                interactive: true, // 是否点击其他地方关闭
                placement: 'top-start',
                trigger: 'click', // 点击显示
            });
        }
        this.appendChild(label);
        if (this.customElement) {
            this.appendChild(this.customElement);
        } else {
            const dom = document.createElement('div');
            dom.classList.add("input-wrapper");
            if (this.className) {
                dom.classList.add(this.className);
            }
            if (!this.inputElement) {
                this.inputElement = document.createElement('input');
                this.inputElement.type = this.type;
            }
            this.inputElement.onchange = (e) => this.onChangeValue(e, this.element, this.modeler);
            dom.appendChild(this.inputElement);
            this.appendChild(dom);
        }
        this.labelElement = this;
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        console.log('onChangeValue', e, element, modeler);
    }

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner) {
        this.modeler = modeler;
        super.onCreate(modeler, designer);
    }

    onChange(element: BpmnElement) {
        this.element = element;
        // this.inputElement && (this.inputElement.value = element.id);
    }

    onShow(open?: boolean) {
        if (this.labelElement) {
            this.labelElement.style.display = open ? 'grid' : 'none';
        }
    }
}
