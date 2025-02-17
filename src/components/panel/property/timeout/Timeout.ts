import {PanelInput} from "../PanelInput.ts";
import {t} from "i18next";

export class Timeout extends PanelInput {

    days = 0;
    hours = 0;
    minutes = 0;
    pickerPanel!: HTMLDivElement;
    constructor() {
        super();
        this.inputLabel = 'timeout';
        this.init();
    }

    init() {
        const timeoutPicker = document.createElement('div');
        timeoutPicker.classList.add('timeout-picker');
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        const dom = document.createElement('input');
        dom.type = 'text';
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
            this.minutes = 0;
            this.days = 0;
            this.hours = 0;
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
        input.value = `${this.days}`;
        input.min = '0';
        input.onchange = () => this.handleNumberChange(unit);
        numberInput.appendChild(input);

        const button2 = document.createElement('button');
        button2.innerText = '+';
        button2.addEventListener('click', () => this.updateValue(unit, 1));
        numberInput.appendChild(button2);

        panelRow.appendChild(numberInput);
        parent.appendChild(panelRow);
    }

    handleNumberChange(unit: "d" | "h" | "m") {
        if (unit === "h") {
            this.hours = Math.min(Math.max(this.hours, 0), 23);
        } else if (unit === "m") {
            this.minutes = Math.min(Math.max(this.minutes, 0), 59);
        }
    }

    updateValue(unit: "d" | "h" | "m", delta: number) {
        if (unit === "d") {
            this.days = Math.max(0, this.days + delta);
        } else if (unit === "h") {
            this.hours = Math.min(Math.max(0, this.hours + delta), 23);
        } else {
            this.minutes = Math.min(Math.max(0, this.minutes + delta), 59);
        }
    }
}