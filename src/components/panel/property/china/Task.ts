import { PanelInput } from "../PanelInput.ts";
import { Modeler, Element } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import {AreaEditor} from "../../../../utils/areaEditor.ts";

export class Task extends PanelInput {

    constructor() {
        super();
        this.type = 'text';
        this.inputLabel = 'task';
        this.init();
    }

    init() {
        this.inputElement = document.createElement('textarea');
        this.inputElement.style.minHeight = '60px';
        new AreaEditor(this.inputElement);
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.$attrs.task || '');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('task', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
