import { PanelInput } from "../PanelInput.ts";
import { Element } from "bpmn-js";
import { EasyBpmnDialog } from "../../../EasyBpmnDialog.ts";
import { t } from "i18next";
import { AreaEditor } from "../../../../utils/areaEditor.ts";
import jsYaml from "js-yaml";

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
                    // 校验json/yaml
                    jsYaml.load(e.detail);
                    if (this.modeler) {
                        const modeling = this.modeler?.get("modeling");
                        const bpmnFactory = this.modeler?.get("bpmnFactory");
                        const meta = bpmnFactory.create("solon:Meta", { body: e.detail });
                        modeling.updateProperties(this.element, { meta });
                        this.inputElement.value = e.detail;
                    }
                } catch (err) {
                    console.warn("Meta Properties 不是一个JSON/YAML");
                }
            })
        });
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.meta?.body || '{}');
    }

}
