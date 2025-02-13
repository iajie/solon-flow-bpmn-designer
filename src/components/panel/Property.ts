import {AbstractPanel} from "./AbstractPanel.ts";
import {BpmnElement} from "bpmn-js";

export class Property extends AbstractPanel {

    constructor() {
        super();
    }

    onChange(element: BpmnElement) {
        console.log(element);
    }
}