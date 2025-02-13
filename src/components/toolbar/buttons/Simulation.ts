import {AbstractToolBar} from "../AbstractToolBar.ts";
import ToggleMode from "bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode";

export class Simulation extends AbstractToolBar {

    constructor() {
        super();
        this.template = `<div>
            <svg t="1739257265021" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6486" width="200" height="200"><path d="M792.512 162.624A446.688 446.688 0 0 0 512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448a37.344 37.344 0 0 0-74.656 0c0 206.208-167.168 373.344-373.344 373.344-206.208 0-373.344-167.168-373.344-373.344C138.656 305.792 305.792 138.656 512 138.656a372.16 372.16 0 0 1 233.92 82.336l-49.088-9.472a37.344 37.344 0 0 0-14.208 73.28l183.232 35.616c3.296 0.64 6.72 0.832 10.08 0.576a37.344 37.344 0 0 0 33.056-49.408l-60.768-176.48a37.344 37.344 0 1 0-70.624 24.256l14.912 43.264zM549.12 320.96a37.344 37.344 0 0 0-74.464 4.384v218.752l0.256 4.864c1.056 7.968 4.64 15.36 10.208 21.12l149.344 154.56 3.456 3.104a37.344 37.344 0 0 0 49.312-2.24l3.136-3.456a37.344 37.344 0 0 0-2.24-49.312l-138.88-143.712 0.096-203.68-0.224-4.384z" p-id="6487"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    onClick() {
        const tokenSimulation = this.modeler?.get<ToggleMode>("toggleMode");
        if (tokenSimulation) {
            tokenSimulation.toggleMode();
        }
    }
}