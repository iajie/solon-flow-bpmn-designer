import { CustomMenu } from "../../types/easy-bpmn-designer.ts";
import { AbstractToolBar } from "./AbstractToolBar.ts";
import { t } from "i18next";
import tippy from "tippy.js";
import { Custom } from "./Custom.ts";
import { Modeler } from "bpmn-js";
import { SolonFlowBpmnDesigner } from "../../core";

export const initToolbarKeys = (modeler: Modeler, designer: SolonFlowBpmnDesigner, menuButtons: AbstractToolBar[], toolbarKeys: (string | CustomMenu)[]) => {
    for (let i = 0; i < toolbarKeys.length; i++) {
        let toolbarKey = toolbarKeys[i];
        if (!toolbarKey) continue;
        try {
            const container = document.querySelector('.easy-bpmn-designer-container')!;
            if (typeof toolbarKey === "string") {
                toolbarKey = toolbarKey.trim();
                if (toolbarKey === "|") {
                    toolbarKey = "divider";
                }
                const menuButton = document.createElement(`easy-bpmn-designer-toolbar-${ toolbarKey }`) as AbstractToolBar;
                menuButton.classList.add("easy-bpmn-designer-menu-item");
                if (i === 0) {
                    menuButton.classList.add('first');
                }
                menuButton.onCreate(modeler, designer);
                if (toolbarKey !== "divider") {
                    const tip = t(toolbarKey) as string;
                    menuButton.setAttribute("data-title", tip);
                    menuButton.setAttribute("data-size", designer.options.toolbarSize || 'small' as string);
                    tip && tippy(menuButton, {
                        appendTo: container,
                        content: tip,
                        theme: 'easy-bpmn-designer-tip',
                        arrow: true,
                        placement: 'bottom',
                    });
                }

                menuButtons.push(menuButton);
            } else {
                const customMenuConfig = toolbarKey as CustomMenu;
                const menuButton = document.createElement("easy-bpmn-designer-toolbar-custom") as Custom;
                menuButton.classList.add("easy-bpmn-designer-menu-item")
                if (customMenuConfig.id) {
                    menuButton.setAttribute("id", customMenuConfig.id);
                }
                if (customMenuConfig.className) {
                    menuButton.classList.add(customMenuConfig.className);
                }
                menuButton.onConfig(customMenuConfig);
                menuButton.onCreate(modeler, designer);
                if (customMenuConfig.tip) {
                    const tip = t(customMenuConfig.tip) as string;
                    tip && tippy(menuButton, {
                        appendTo: container,
                        content: tip,
                        theme: 'easy-bpmn-designer-tip',
                        arrow: true,
                        placement: 'bottom',
                    });
                }
                menuButtons.push(menuButton);
            }
        } catch (e) {
            console.log('创建按钮', e)
        }
    }
}
