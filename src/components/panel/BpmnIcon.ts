import {AbstractPanel} from "./AbstractPanel.ts";
import {getBpmnIcon} from "./icons/IconType.ts";
import {formatIcon} from "./icons";
import {t} from 'i18next';
import {BpmnElement} from "bpmn-js";

export class BpmnIcon extends AbstractPanel {

    constructor() {
        super();
    }

    onChange(element: BpmnElement) {
        const icon = getBpmnIcon(element as any);
        const html = `${formatIcon(icon)}${t(icon)}`;
        if (!this.template) {
            this.template = html;
        } else {
            super.innerHTML = `${formatIcon(icon)}${t(icon)}`;
        }
    }
}