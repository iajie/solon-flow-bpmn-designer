import { download, zoomIn, zoomOut } from "./menus/icons.ts";
import { downloadSvg } from "../utils/bpmnUtils.ts";
import { SolonFlowBpmnViewer } from "../core";

export class ViewerToolbar extends HTMLElement {

    viewer: SolonFlowBpmnViewer;

    constructor(viewer: SolonFlowBpmnViewer) {
        super();
        this.viewer = viewer;
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("solon-flow-bpmn-viewer-container-toolbar");
        this.appendChild(this.createZoomIn());
        this.appendChild(this.createZoomOut());
        this.appendChild(this.createDownload());
    }

    private createZoomIn() {
        const dom = document.createElement("div");
        dom.innerHTML = zoomIn;
        dom.addEventListener('click', () => this.zoom(true));
        return dom;
    }

    private createZoomOut() {
        const dom = document.createElement("div");
        dom.innerHTML = zoomOut;
        dom.addEventListener('click', () => this.zoom(false));
        return dom;
    }

    private createDownload() {
        const dom = document.createElement("div");
        dom.innerHTML = download;
        dom.addEventListener('click', () => {
            if (this.viewer.options.customDownload) {
                this.viewer.options.customDownload(this.viewer.getViewer());
            } else {
                downloadSvg(this.viewer.getModeler());
            }
        });

        return dom;
    }

    private zoom(action = false) {
        const canvas = this.viewer.getModeler().get("canvas");
        const zoom = canvas.zoom();
        canvas.zoom(zoom + (action ? 0.1 : -0.1));
    }
}
