import {CustomMenu, EasyBpmnDesignerOptions, MenuGroup} from "../types/easy-bpmn-designer.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {AbstractToolBar} from "../components/toolbar/AbstractToolBar.ts";
import {t} from "i18next";
import tippy from "tippy.js";
import {Group} from "../components/toolbar/Group.ts";
import {Custom} from "../components/toolbar/Custom.ts";

export const initToolbarKeys = (modeler: BpmnModeler,
                                options: EasyBpmnDesignerOptions,
                                menuButtons: AbstractToolBar[],
                                toolbarKeys: (string | CustomMenu | MenuGroup)[]) => {
    for (let i = 0; i < toolbarKeys.length; i++) {
        let toolbarKey = toolbarKeys[i];
        if (!toolbarKey) continue;
        try {
            const container = document.querySelector('.easy-bpmn-designer-container') || undefined;
            if (typeof toolbarKey === "string") {
                toolbarKey = toolbarKey.trim();
                if (toolbarKey === "|") {
                    toolbarKey = "divider";
                }
                const menuButton = document.createElement(`easy-bpmn-designer-toolbar-${toolbarKey}`) as AbstractToolBar;
                menuButton.classList.add("easy-bpmn-designer-menu-item");
                if (i === 0) {
                    menuButton.classList.add('first');
                }
                menuButton.onCreate(modeler, options);
                if (toolbarKey !== "divider") {
                    const tip = t(toolbarKey) as string;
                    menuButton.setAttribute("data-title", tip);
                    menuButton.setAttribute("data-size", options.toolbarSize || 'small' as string);
                    tip && tippy(menuButton, {
                        appendTo: container,
                        content: tip,
                        theme: 'easy-bpmn-designer-tip',
                        arrow: true,
                    });
                }

                menuButtons.push(menuButton);
            } else {
                if ((toolbarKey as any).toolbarKeys) {
                    const menuGroup = toolbarKey as MenuGroup;
                    const menuButton = document.createElement("easy-bpmn-designer-group") as Group;
                    menuButton.classList.add("easy-bpmn-designer-menu-item")

                    menuButton.onCreate(modeler, options);
                    menuButton.init(modeler, options, menuGroup);
                    if (menuGroup.title) {
                        const tip = t(menuGroup.title) as string;
                        tip && tippy(menuButton, {
                            appendTo: container,
                            content: tip,
                            theme: 'easy-bpmn-designer-tip',
                            arrow: true,
                        });
                    }
                    menuButtons.push(menuButton);
                } else {
                    const customMenuConfig = toolbarKey as CustomMenu;
                    const menuButton = document.createElement("easy-bpmn-designer-custom") as Custom;
                    menuButton.classList.add("easy-bpmn-designer-menu-item")

                    if (customMenuConfig.id) {
                        menuButton.setAttribute("id", customMenuConfig.id);
                    }
                    if (customMenuConfig.className) {
                        menuButton.classList.add(customMenuConfig.className);
                    }
                    menuButton.onCreate(modeler, options);
                    menuButton.onConfig(customMenuConfig);

                    if (customMenuConfig.tip) {
                        const tip = t(customMenuConfig.tip) as string;
                        tip && tippy(menuButton, {
                            appendTo: container,
                            content: tip,
                            theme: 'easy-bpmn-designer-tip',
                            arrow: true,
                            // trigger:"click",
                            // interactive:true,
                        });
                    }
                    if (customMenuConfig.onCreate) {
                        customMenuConfig.onCreate(menuButton, modeler);
                    }
                    menuButtons.push(menuButton);
                }
            }
        } catch (e) {
            console.log('创建按钮', e)
        }
    }
}