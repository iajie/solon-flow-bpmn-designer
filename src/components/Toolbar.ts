import { DesignerEventListener, SolonFlowBpmnDesigner } from "../core";
import { Modeler } from 'bpmn-js';
import { defineCustomElement } from "../utils/domUtils.ts";
import { AbstractToolBar, initToolbarKeys, Divider, Import, Download, PreviewXml, PreviewJson, Undo, Redo,
    ZoomIn, ZoomOut, Reset, MiniMap, defaultToolbarKeys, Custom } from "./menus";

defineCustomElement('easy-bpmn-designer-toolbar-divider', Divider);
defineCustomElement('easy-bpmn-designer-toolbar-import', Import);
defineCustomElement('easy-bpmn-designer-toolbar-download', Download);
defineCustomElement('easy-bpmn-designer-toolbar-preview-yaml', PreviewXml);
defineCustomElement('easy-bpmn-designer-toolbar-preview-json', PreviewJson);
defineCustomElement('easy-bpmn-designer-toolbar-undo', Undo);
defineCustomElement('easy-bpmn-designer-toolbar-redo', Redo);
defineCustomElement('easy-bpmn-designer-toolbar-zoom-in', ZoomIn);
defineCustomElement('easy-bpmn-designer-toolbar-zoom-out', ZoomOut);
defineCustomElement('easy-bpmn-designer-toolbar-reset', Reset);
defineCustomElement('easy-bpmn-designer-toolbar-minimap', MiniMap);
defineCustomElement('easy-bpmn-designer-toolbar-custom', Custom);

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

    onCreate(modeler: Modeler, designer: SolonFlowBpmnDesigner): void {
        let toolbarKeys = defaultToolbarKeys;
        const customMenus = designer.options.toolbarKeys || [];
        if (customMenus.length) {
            toolbarKeys = toolbarKeys.filter((item: any) => !customMenus.includes(item));
            toolbarKeys.push("divider");
            // @ts-ignore
            toolbarKeys.push(...customMenus);
        }
        toolbarKeys = toolbarKeys.filter((tool) => {
            return !designer.options.toolbarExcludeKeys?.includes(tool);
        }).filter((tool, index, array) => {
            const prevTool = array[index - 1];
            const dividers = ['divider', '|', undefined];
            return dividers.includes(tool as any) ? !dividers.includes(prevTool) : true;
        });
        // 初始化顶部工具栏
        initToolbarKeys(modeler, designer, this.toolbars, toolbarKeys);
    }

}
