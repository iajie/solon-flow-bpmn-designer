import { PanelInput } from "../PanelInput.ts";
import { Modeler, Element } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import {AreaEditor} from "../../../../utils/areaEditor.ts";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";

export class Task extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'task';
        this.init();
    }

    init() {
        this.inputElement = document.createElement('textarea');
        this.inputElement.style.minHeight = '120px';
        new AreaEditor(this.inputElement);
        this.inputElement.readOnly = true;
        this.inputElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('metaTitle'),
                content: this.inputElement.value || ``,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                this.inputElement.value = e.detail;
                updateProperty('task', e.detail, this.element, this.modeler);
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.task || '');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('task', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
