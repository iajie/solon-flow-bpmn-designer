import { AbstractToolBar } from "../AbstractToolBar.ts";
import { zoomOut } from "../icons.ts";

export class ZoomOut extends AbstractToolBar {

    constructor() {
        super();
        this.template = `<div>${zoomOut}</div>`;
        this.registerClickListener();
    }

    onClick() {
        const canvas = this.modeler?.get('canvas');
        const zoom = canvas?.zoom();
        zoom && canvas?.zoom(zoom - 0.1);
    }
}
