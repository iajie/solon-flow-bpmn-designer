import {PanelInput} from "../PanelInput.ts";
import { t } from "i18next";
import { BpmnElement } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";

export class Timeout extends PanelInput {

    pickerPanel!: HTMLDivElement;

    timeElements: HTMLInputElement[] = [];

    valueInput!: HTMLInputElement;

    constructor() {
        super();
        this.inputLabel = 'timeout';
        this.init();
    }

    handleClickOutside(event: MouseEvent, dom: HTMLDivElement) {
        const target = event.target as HTMLElement;
        if (!target.closest(".timeout-picker")) {
            this.close(dom);
            this.pickerPanel.style.display = "none";
        }
    }

    init() {
        const timeoutPicker = document.createElement('div');
        timeoutPicker.classList.add('timeout-picker');
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        const dom = document.createElement('input');
        dom.type = 'text';
        dom.readOnly = true;
        this.valueInput = dom;
        const span = document.createElement('span');
        span.classList.add('picker-trigger');

        span.innerHTML = `<svg t="1739778338323" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4139" width="200" height="200"><path d="M512 960C265.6 960 64 758.4 64 512S265.6 64 512 64s448 201.6 448 448-201.6 448-448 448z m0-832C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128z" p-id="4140"></path><path d="M736 480H544V224c0-17.6-14.4-32-32-32s-32 14.4-32 32v288c0 17.6 14.4 32 32 32h224c17.6 0 32-14.4 32-32s-14.4-32-32-32z" p-id="4141"></path></svg>`;
        inputWrapper.appendChild(dom);
        inputWrapper.appendChild(span);
        timeoutPicker.appendChild(inputWrapper);

        const pickerPanel = document.createElement('div');
        pickerPanel.classList.add('picker-panel');
        pickerPanel.style.display = 'none';

        span.addEventListener('click', () => this.close(pickerPanel));
        this.createPanelRow('days', 'd', pickerPanel);
        this.createPanelRow('hours', 'h', pickerPanel);
        this.createPanelRow('minutes', 'm', pickerPanel);
        this.pickerPanel = pickerPanel;
        timeoutPicker.appendChild(this.pickerPanel);

        const panelFooter = document.createElement('div');
        panelFooter.classList.add('panel-footer');
        const clear = document.createElement('button');
        clear.classList.add('btn-clear');
        clear.innerText = t('clear');
        clear.addEventListener('click', () => {
            for (let dom of this.timeElements) {
                dom.value = '0';
            }
            this.close(pickerPanel);
        });
        panelFooter.appendChild(clear);

        const confirm = document.createElement('button');
        confirm.classList.add('btn-confirm');
        confirm.innerText = t('confirm');
        confirm.addEventListener('click', () => {
            this.close(pickerPanel);
        });
        panelFooter.appendChild(confirm);
        pickerPanel.appendChild(panelFooter);

        this.customElement = timeoutPicker;

        // 在组件外点击时关闭面板
        document.addEventListener('click', (e) => this.handleClickOutside(e, pickerPanel));
    }

    onChangeValue(e: any) {
        updateProperty('dueDate', e, this.element, this.modeler);
    }

    onChange(element: BpmnElement) {
        const value = element.businessObject.dueDate || "";
        this.valueInput && (this.valueInput.value = value);
        this.parseTimeString(value);
    }

    close(dom: HTMLDivElement) {
        const display = dom.style.display;
        if (display === 'block') {
            dom.style.display = 'none';
        } else {
            dom.style.display = 'block';
        }
    }

    createPanelRow(title: string, unit: 'd' | 'h' | 'm', parent: HTMLDivElement) {
        const panelRow = document.createElement('div');
        panelRow.classList.add('panel-row');
        const span = document.createElement('span');
        span.classList.add('label');
        span.innerText = t(title);
        panelRow.appendChild(span);

        const numberInput = document.createElement('div');
        numberInput.classList.add('number-input');

        const button = document.createElement('button');
        button.innerText = '-';
        button.addEventListener('click', () => this.updateValue(unit, -1));
        numberInput.appendChild(button);

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.oninput = (e) => this.handleNumberChange(unit, (e.target as HTMLInputElement).value);
        input.id = `${unit}`;
        this.timeElements.push(input);
        numberInput.appendChild(input);

        const button2 = document.createElement('button');
        button2.innerText = '+';
        button2.addEventListener('click', () => this.updateValue(unit, 1));
        numberInput.appendChild(button2);

        panelRow.appendChild(numberInput);
        parent.appendChild(panelRow);
    }

    handleNumberChange(unit: "d" | "h" | "m", number: string) {
        this.updateValue(unit, Number(number), true);
    }

    updateValue(unit: "d" | "h" | "m", delta: number, eq?: boolean) {
        for (let dom of this.timeElements) {
            if (dom.id.endsWith(unit)) {
                let value = Number(dom.value);
                if (unit === "d") {
                    value = eq ? delta : Math.max(0, value + delta);
                } else if (unit === "h") {
                    value = eq ? delta : Math.min(Math.max(0, value + delta), 23);
                } else {
                    value = eq ? delta : Math.min(Math.max(0, value + delta), 59);
                }
                dom.value = `${value}`;
            }
        }
        const value = this.formatTime();
        this.valueInput.value = value;
        this.onChangeValue(value);
    }

    parseTimeString(timeStr: string) {
        if (!timeStr || !timeStr.startsWith('P')) {
            // 设置默认值
            this.timeElements.forEach(dom => dom.value = "0");
            return;
        }

        const d = timeStr.match(/(\d+)D/)?.[1] || "0";
        const h = timeStr.match(/(\d+)H/)?.[1] || "0";
        const m = timeStr.match(/(\d+)M(?!.*D)/)?.[1] || "0"; // 使用负向前瞻确保匹配的是分钟而不是月份
        
        for (let dom of this.timeElements) {
            if (dom.id.endsWith('d')) {
                dom.value = d;
            } else if (dom.id.endsWith('h')) {
                dom.value = h;
            } else {
                dom.value = m;
            }
        }
    }

    formatTime() {
        let days = 0, hours = 0, minutes = 0;
        
        for (let dom of this.timeElements) {
            const value = parseInt(dom.value) || 0;
            if (dom.id.endsWith('d')) {
                days = value;
            } else if (dom.id.endsWith('h')) {
                hours = value;
            } else {
                minutes = value;
            }
        }

        // 如果所有值都是0，返回空字符串
        if (days === 0 && hours === 0 && minutes === 0) {
            return '';
        }

        let result = 'P';
        if (days > 0) {
            result += `${days}D`;
        }
        
        if (hours > 0 || minutes > 0) {
            result += 'T';
            if (hours > 0) {
                result += `${hours}H`;
            }
            if (minutes > 0) {
                result += `${minutes}M`;
            }
        }

        return result;
    }
}