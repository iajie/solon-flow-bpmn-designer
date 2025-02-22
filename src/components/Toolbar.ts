import {AbstractToolBar} from "./toolbar/AbstractToolBar.ts";
import {DesignerEventListener} from "../core/EasyBpmnDesigner.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {EasyBpmnDesignerOptions} from "../types/easy-bpmn-designer.ts";

import { Divider, Import, Download, PreviewXml, PreviewJson, Undo, Redo,
    ZoomIn, ZoomOut, Reset, Simulation, MiniMap, defaultToolbarKeys  } from "./toolbar/index.ts";
import {defineCustomElement} from "../utils/domUtils.ts";
import {initToolbarKeys} from "./toolbar/initToolbarKeys.ts";

defineCustomElement('easy-bpmn-designer-toolbar-divider', Divider);
defineCustomElement('easy-bpmn-designer-toolbar-import', Import);
defineCustomElement('easy-bpmn-designer-toolbar-download', Download);
defineCustomElement('easy-bpmn-designer-toolbar-preview-xml', PreviewXml);
defineCustomElement('easy-bpmn-designer-toolbar-preview-json', PreviewJson);
defineCustomElement('easy-bpmn-designer-toolbar-undo', Undo);
defineCustomElement('easy-bpmn-designer-toolbar-redo', Redo);
defineCustomElement('easy-bpmn-designer-toolbar-zoom-in', ZoomIn);
defineCustomElement('easy-bpmn-designer-toolbar-zoom-out', ZoomOut);
defineCustomElement('easy-bpmn-designer-toolbar-reset', Reset);
defineCustomElement('easy-bpmn-designer-toolbar-simulation', Simulation);
defineCustomElement('easy-bpmn-designer-toolbar-minimap', MiniMap);

export class Toolbar extends HTMLElement implements DesignerEventListener {

    toolbars: AbstractToolBar[] = [];

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("easy-bpmn-designer-container-toolbar");
        for (let menuButton of this.toolbars) {
            this.appendChild(menuButton);
        }
    }

    onCreate(modeler: BpmnModeler, options: EasyBpmnDesignerOptions): void {
        let toolbarKeys = options.toolbarKeys || defaultToolbarKeys;
        toolbarKeys = toolbarKeys.filter((tool) => {
            if (typeof tool === "string") {
                return !options.toolbarExcludeKeys?.includes(tool);
            }
            return true;
        }).filter((tool, index, array) => {
            const prevTool = array[index -1];
            if (typeof tool === "string" && typeof prevTool === "string" || typeof prevTool === "undefined") {
                const dividers = ['divider', '|', undefined];
                return dividers.includes(tool as any) ? !dividers.includes(prevTool) : true;
            }
        });
        // 初始化顶部工具栏
        initToolbarKeys(modeler, options, this.toolbars, toolbarKeys);
    }

}