import { PanelInput } from "../PanelInput.ts";
import { Element } from "bpmn-js";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";
import jsYaml from "js-yaml";
import { CodeHighlight } from "../../../CodeHighlight.ts";

export class Meta extends PanelInput {

    private value: string;

    constructor() {
        super();
        this.inputLabel = 'meta';
        this.value = '{}';
        this.init();
    }

    init() {
        this.customElement = document.createElement('div');
        this.customElement.style.minHeight = '180px';
        this.customElement.classList.add('property-item-code');
        this.customElement.addEventListener('click', () => {
            const dialog = new EasyBpmnDialog({
                edit: true,
                title: t('metaTitle'),
                content: this.value,
            });
            dialog.addEventListener('code-edit', (e: any) => {
                try {
                    // 校验json/yaml
                    jsYaml.load(e.detail);
                    if (this.modeler) {
                        const modeling = this.modeler?.get("modeling");
                        const bpmnFactory = this.modeler?.get("bpmnFactory");
                        const meta = bpmnFactory.create("solon:Meta", { body: e.detail });
                        modeling.updateProperties(this.element, { meta });
                        this.value = e.detail;
                        this.codeShow();
                    }
                } catch (err) {
                    console.warn("Meta Properties 不是一个JSON/YAML");
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.value = JSON.stringify(JSON.parse(element.businessObject.meta?.body || '{}'), null, 4);
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
            type: 'javascript'
        }));
    }

}
