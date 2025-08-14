import { AbstractToolBar } from "../AbstractToolBar.ts";
import highlight from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import { EasyBpmnDialog } from "../../EasyBpmnDialog.ts";
import { defineCustomElement } from "../../../utils/domUtils.ts";
import { t } from "i18next";
import { toSolonJson } from "../../../utils/bpmnUtils.ts";
import jsYaml from 'js-yaml';

defineCustomElement('easy-bpmn-designer-dialog', EasyBpmnDialog);

export class PreviewCode extends AbstractToolBar {

    constructor() {
        super();
    }

    protected handlePreview = async (type: "yaml" | "json") => {
        if (!this.modeler) return;
        try {
            const elementRegistry = this.modeler?.get("elementRegistry") as any;
            if (elementRegistry) {
                const elements = elementRegistry.getAll();
                const processData = elements.reduce((acc: any, element: any) => {
                    if (element.type === "bpmn:Process") {
                        return toSolonJson(element);
                    }
                    return acc;
                }, {});
                if (type === "yaml") {
                    this.insertCode(jsYaml.dump(processData), type);
                } else {
                    const code = JSON.stringify(processData, null, 2);
                    this.insertCode(code, type);
                }
            }
        } catch (error) {
            console.error("预览失败:", error);
        }
    }

    private insertCode(code: string, type: "yaml" | "json") {
        const sourceCode = highlight.highlight(code, {
            language: type,
            ignoreIllegals: true
        });
        new EasyBpmnDialog({
            title: type === 'yaml' ? t('preview-yaml') : t('preview-json'),
            content: `<pre>${ sourceCode.value }</pre>`,
            text: code
        });
    }

}
