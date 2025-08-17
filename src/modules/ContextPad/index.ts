import { EasyBpmnNodeContextPadProvider } from "./Node.ts";
import { EasyBpmnContextPadProvider } from "./Pad.ts";
import { EasyBpmnColorContextPadProvider } from "./Color.ts";

export const EasyBpmnDesignerContextPad = {
    __init__: ["enhancementContextPadProvider", "contextPadProvider", "colorContextPadProvider"],
    enhancementContextPadProvider: ["type", EasyBpmnContextPadProvider],
    contextPadProvider: ["type", EasyBpmnNodeContextPadProvider],
    colorContextPadProvider: ['type', EasyBpmnColorContextPadProvider],
};
