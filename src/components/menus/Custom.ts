import { AbstractToolBar } from "./AbstractToolBar.ts";
import { CustomMenu } from "../../types/easy-bpmn-designer.ts";

export class Custom extends AbstractToolBar {

    config?: CustomMenu;

    constructor() {
        super();
    }

    onConfig(customMenu: CustomMenu) {
        this.config = customMenu;

        if (customMenu.html) {
            this.template = customMenu.html;
        } else if (customMenu.icon) {
            this.template = `<div style="height: 16px">${customMenu.icon}</div>`;
        }

        this.addEventListener("click", (e) => {
            if (this.config && this.config.onClick && this.designer) {
                this.config.onClick(e, this.designer);
            }
        })
    }

}


