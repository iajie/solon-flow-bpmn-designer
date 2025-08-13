import { PanelInput } from "../PanelInput.ts";
import { Modeler, Element } from "bpmn-js";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import {AreaEditor} from "../../../../utils/areaEditor.ts";

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
    }

    onChange(element: Element) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.when || '');
    }

    onChangeValue(e: Event, element: Element, modeler?: Modeler) {
        updateProperty('when', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
