import { PanelInput } from "../PanelInput.ts";
import { Element } from "bpmn-js";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";
import { CodeHighlight } from "../../../CodeHighlight.ts";

export class When extends PanelInput {

    private value: string;

    constructor() {
        super();
        this.inputLabel = 'when';
        this.value = '';
        this.init();
    }

    init() {
        this.customElement = document.createElement('div');
        this.customElement.style.height = '60px';
        this.customElement.classList.add('property-item-code');
        this.customElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('whenTitle'),
                content: this.value || ``,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                if (this.modeler) {
                    const modeling = this.modeler?.get("modeling");
                    const bpmnFactory = this.modeler?.get("bpmnFactory");
                    const when = bpmnFactory.create("solon:When", { body: e.detail });
                    modeling.updateProperties(this.element, { when });
                    this.value = e.detail;
                    this.codeShow();
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.value = element.businessObject.when?.body || '';
        this.codeShow();
    }

    codeShow() {
        if (this.customElement.children.length) {
            for (let i = 0; i < this.customElement.children.length; i++) {
                this.customElement.removeChild(this.customElement.children[i]);
            }
        }
        this.customElement.appendChild(new CodeHighlight({
            source: this.value,
        }));
    }

}
