import { EasyBpmnPopupMenuProvider } from "./Menu.ts";
import { EasyBpmnColorPopupMenuProvider } from "./Color.ts";

export const EasyBpmnDesignerPopupMenu = {
    __init__: ['paletteProvider', "colorPopupProvider"],
    replaceMenuProvider: ['type', EasyBpmnPopupMenuProvider],
    colorPopupProvider: ['type', EasyBpmnColorPopupMenuProvider],
};
