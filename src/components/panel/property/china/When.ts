import { PanelInput } from "../PanelInput.ts";
import { Element } from "bpmn-js";
import {AreaEditor} from "../../../../utils/areaEditor.ts";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";

export class When extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'when';
        this.init();
    }

    init() {
        this.inputElement = document.createElement('textarea');
        this.inputElement.style.minHeight = '60px';
        new AreaEditor(this.inputElement);
        this.inputElement.readOnly = true;
        this.inputElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('whenTitle'),
                content: this.inputElement.value || ``,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                if (this.modeler) {
                    const modeling = this.modeler?.get("modeling");
                    const bpmnFactory = this.modeler?.get("bpmnFactory");
                    const when = bpmnFactory.create("solon:When", { body: e.detail });
                    modeling.updateProperties(this.element, { when });
                    this.inputElement.value = e.detail;
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.when?.body || '');
    }

}
