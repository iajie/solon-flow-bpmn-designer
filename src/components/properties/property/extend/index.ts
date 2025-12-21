import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import { t } from "i18next";

const types = ['string', 'text', 'number', 'date', 'boolean', 'enum'];

type attributes = {
    key: string;
    value: any;
    type: string;
};

export class ExtendAttributes extends PanelInput {

    table!: HTMLTableElement;
    extendAttributes: attributes[] = [];
    meta: any = {};

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('property-extend');
        // 表格
        this.table = document.createElement('table');
        this.table.border = '1';
        this.createTHead();
        this.createAddRow();
        this.appendChild(this.table);
    }

    createAddRow() {
        // 新增按钮
        const foot = document.createElement('tr');
        const button = document.createElement('td');
        button.colSpan = 4;
        const add = document.createElement('button');
        add.textContent = "添加属性";
        add.addEventListener('click', () => {
            this.createTBody();
            this.extendAttributes.push({
                key: '',
                value: '',
                type: 'string'
            });
            this.updateProperties();
        });
        button.appendChild(add);
        foot.appendChild(button);
        this.table.createTFoot().appendChild(foot);
    }

    createTHead() {
        // 表格->行
        const tr = document.createElement('tr');
        // 表格->行->第一列(属性value type)
        const key = document.createElement('td');
        key.textContent = t('key');
        const type = document.createElement('td');
        type.textContent = t('type');
        // 表格->行->第一列(属性value)
        const value = document.createElement('td');
        value.textContent = t('value');
        // 操作
        const action = document.createElement('td');
        action.textContent = t('action');
        action.style.width = '35px';
        tr.appendChild(key);
        tr.appendChild(type);
        tr.appendChild(value);
        tr.appendChild(action);
        this.table.createTHead().appendChild(tr);
    }

    createTBody(data?: attributes) {
        console.log(data);
        // 表格->行
        const tr = document.createElement('tr');
        // 表格->行->第一列(属性key)
        const key = document.createElement('td');
        const keyCell = document.createElement('input');
        keyCell.value = data?.key || '';
        keyCell.addEventListener('input', (e) => this.setElement('key', e, tr.rowIndex));
        key.appendChild(keyCell);
        // 表格->行->第一列(属性value type)
        const type = document.createElement('td');
        const typeCell = document.createElement('select');
        typeCell.value = data?.type || 'string';
        types.forEach(item => {
            const options = document.createElement('option');
            options.label = t(item);
            options.value = item;
            typeCell.add(options);
        });
        typeCell.addEventListener('change', (e) => this.setElement('type', e, tr.rowIndex));
        type.appendChild(typeCell);
        // 表格->行->第一列(属性value)
        const value = document.createElement('td');
        const valueCell = document.createElement('input');
        valueCell.value = data?.value || '';
        valueCell.addEventListener('input', (e) => this.setElement('value', e, tr.rowIndex));
        value.appendChild(valueCell);
        // 操作
        const action = document.createElement('td');
        const actionCell = document.createElement('button');
        actionCell.textContent = t('del');
        actionCell.addEventListener('click', () => tr.remove());
        action.appendChild(actionCell);

        tr.appendChild(key);
        tr.appendChild(type);
        tr.appendChild(value);
        tr.appendChild(action);
        this.table.createTBody().appendChild(tr);
    }

    onChange(element: BpmnElement) {
        this.updateElement(element);
        if (this.meta && this.meta.attributes && Array.isArray(this.meta.attributes)) {
            this.meta.attributes.forEach((item: any) => this.createTBody(item));
        }
    }

    updateElement(element: BpmnElement) {
        const meta = element.businessObject?.meta?.body;
        this.meta = JSON.parse(meta || '{}');
    }

    setElement(key: 'key' | 'value' | 'type', e: any, index: number) {
        this.extendAttributes[index - 1][key] = e.target.value;
        this.updateProperties();
    }

    updateProperties() {
        this.meta.attributes = this.extendAttributes;
        const modeling = this.modeler?.get("modeling");
        const bpmnFactory = this.modeler?.get("bpmnFactory");
        const meta = bpmnFactory?.create("solon:Meta", { body: JSON.stringify(this.meta) });
        modeling?.updateProperties(this.element, { meta });
    }
}
