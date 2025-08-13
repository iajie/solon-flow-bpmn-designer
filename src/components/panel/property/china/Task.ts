import { PanelInput } from "../PanelInput.ts";
import { Element } from "bpmn-js";
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
                title: t('script'),
                content: this.inputElement.value || ``,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                if (this.modeler) {
                    const modeling = this.modeler?.get("modeling");
                    const bpmnFactory = this.modeler?.get("bpmnFactory");
                    const task = bpmnFactory.create("solon:Task", { body: e.detail });
                    modeling.updateProperties(this.element, { task });
                    this.inputElement.value = e.detail;
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.task?.body || '');
    }

}
