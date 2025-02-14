import {BpmnElement} from "bpmn-js";
import BpmnModeler from "bpmn-js/lib/Modeler";

export abstract class PropertyItem extends HTMLElement {

    element: BpmnElement;
    modeler: BpmnModeler;

    protected constructor(element: BpmnElement, modeler: BpmnModeler) {
        super();
        this.element = element;
        this.modeler = modeler;
    }

    bpmnFactory() {
        return this.modeler.get('bpmnFactory');
    }

    modeling() {
        return this.modeler.get('modeling');
    }

}