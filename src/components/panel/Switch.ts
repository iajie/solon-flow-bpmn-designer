import {AbstractPanel} from "./AbstractPanel.ts";

export class Switch extends AbstractPanel {

    constructor() {
        super();
        this.template = `
            <svg t="1739345500641" class="toggle-icon" aria-hidden="true" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5172" width="200" height="200"><path d="M544 522.666667c0-8.533333-4.266667-17.066667-10.666667-23.466667L192 189.866667c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733334 285.866667L149.333333 808.533333c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466667 10.666667 8.533333 0 14.933333-2.133333 21.333333-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666z" fill="#666666" p-id="5173"></path><path d="M864 499.2l-341.333333-309.333333c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733333 285.866667-315.733333 285.866666c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466666 10.666667 8.533333 0 14.933333-2.133333 21.333334-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666 0-8.533333-4.266667-17.066667-10.666667-23.466667z" fill="#666666" p-id="5174"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        const panel = document.querySelector('.easy-bpmn-designer-container-panel');
        const toolbar = document.querySelector('.easy-bpmn-designer-container-toolbar');
        if (panel?.classList.contains('panel-collapsed')) {
            panel.classList.remove('panel-collapsed');
            toolbar?.classList.remove('toolbar-width');
            this.children[0].classList.remove('icon-collapsed');
        } else {
            panel?.classList.add('panel-collapsed');
            toolbar?.classList.add('toolbar-width');
            this.children[0].classList.add('icon-collapsed');
        }
    }

}