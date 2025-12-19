import { AbstractToolBar } from "../AbstractToolBar.ts";
import { zoomIn } from "../icons.ts"

export class ZoomIn extends AbstractToolBar {

    constructor() {
        super();
        this.template = `<div>${zoomIn}</div>`;
        this.registerClickListener();
    }

    onClick() {
        const canvas = this.modeler?.get("canvas");
        const zoom = canvas?.zoom();
        zoom && canvas?.zoom(zoom + 0.1);
    }
}
