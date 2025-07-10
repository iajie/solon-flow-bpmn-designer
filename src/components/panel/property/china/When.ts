import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import Modeler from "bpmn-js/lib/Modeler";
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

    onChange(element: BpmnElement) {
        super.onChange(element);
        this.inputElement && (this.inputElement.value = element.businessObject.$attrs.when || '');
    }

    onChangeValue(e: Event, element: BpmnElement, modeler?: Modeler) {
        updateProperty('when', (e.target as HTMLInputElement).value || '', element, modeler);
    }
}
