import {AbstractToolBar} from "../AbstractToolBar.ts";
import highlight from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import {EasyBpmnDialog} from "../../EasyBpmnDialog.ts";
import {defineCustomElement} from "../../../utils/domUtils.ts";
import {t} from "i18next";

defineCustomElement('easy-bpmn-designer-dialog', EasyBpmnDialog);

export class PreviewCode extends AbstractToolBar {

    constructor() {
        super();
    }

    protected handlePreview = async (type: "xml" | "json") => {
        if (!this.modeler) return;
        try {
            if (type === "xml") {
                const {xml} = await this.modeler.saveXML({format: true});
                if (xml) {
                    this.insertCode(xml, type);
                }
            } else {
                const elementRegistry = this.modeler?.get("elementRegistry") as any;
                if (elementRegistry) {
                    const elements = elementRegistry.getAll();
                    const processData = elements.reduce((acc: any, element: any) => {
                        if (element.type !== "label") {
                            acc[element.id] = {
                                type: element.type,
                                ...element.businessObject
                            };
                        }
                        return acc;
                    }, {});
                    const code = JSON.stringify(processData, null, 2);
                    this.insertCode(code, type);
                }
            }
        } catch (error) {
            console.error("预览失败:", error);
        }
    }

    private insertCode(code: string, type: "xml" | "json") {
        const sourceCode = highlight.highlight(code, {
            language: type,
            ignoreIllegals: true
        });
        new EasyBpmnDialog({
            title: type === 'xml' ? t('preview-xml') : t('preview-json'),
            content: `<pre>${sourceCode.value}</pre>`,
        });
    }

}