import { PanelInput } from "../PanelInput.ts";
import { Element, Modeler } from "bpmn-js";
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
        this.inputElement.style.minHeight = '180px';
        new AreaEditor(this.inputElement);
        this.inputElement.readOnly = true;
        this.inputElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('metaTitle'),
                content: this.inputElement.value || `{}`,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                try {
                    const meta = JSON.parse(e.detail);
                    updateProperty('meta', JSON.stringify(meta), this.element, this.modeler);
                    this.inputElement.value = e.detail;
                } catch (err) {
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.meta || element.businessObject['$attrs'].meta || '{}');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('meta', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
