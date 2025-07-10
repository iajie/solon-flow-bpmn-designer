import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import {EasyBpmnDialog} from "../../../EasyBpmnDialog.ts";
import {t} from "i18next";
import {AreaEditor} from "../../../../utils/areaEditor.ts";

export class Meta extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'meta';
        this.init();
    }

    init() {
        this.inputElement = document.createElement('textarea');
        this.inputElement.style.minHeight = '200px';
        new AreaEditor(this.inputElement);
        this.inputElement.readOnly = true;
        this.inputElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('metaTitle'),
                content: this.inputElement.value || `{}`,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                this.inputElement.value = e.detail;
                updateProperty('meta', e.detail, this.element, this.modeler);
            })
        });
    }

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.$attrs.meta || '{}');
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('meta', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
