import { PanelInput } from "../PanelInput.ts";
import { updateCondition } from "../../../../utils/bpmnUtils.ts";
import { Element } from "bpmn-js";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";
import { CodeHighlight } from "../../../CodeHighlight.ts";

export class ConditionExpression extends PanelInput {

    private value: string;

    constructor() {
        super();
        this.inputLabel = 'conditionExpression';
        this.value = '';
        this.init();
    }

    init() {
        this.customElement = document.createElement('div');
        this.customElement.classList.add('property-item-code');
        this.customElement.style.minHeight = '100px';
        this.customElement.style.maxHeight = '180px';
        this.customElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('whenTitle'),
                content: this.value || ``,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                updateCondition('expression', e.detail, this.element, this.modeler);
                this.value = e.detail;
                this.codeShow();
            })
        });
    }

    onChange(element: Element) {
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression') && element.businessObject.conditionExpression !== null);
        this.value = element.businessObject.conditionExpression?.body || '';
        this.codeShow();
    }

    updateElement(element: Element) {
        this.onShow(element.businessObject.hasOwnProperty('conditionExpression') && element.businessObject.conditionExpression !== null);
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
