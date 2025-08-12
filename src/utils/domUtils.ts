export const defineCustomElement = (name: string, element: CustomElementConstructor) => {
    if (!window.customElements.get(name)) {
        window.customElements.define(name, element);
    }
}

export const switchPanel = () => {
    const switchPanel = document.getElementsByTagName('easy-bpmn-designer-panel-switch')[0];
    const panel = document.querySelector('.easy-bpmn-designer-container-panel');
    const toolbar = document.querySelector('.easy-bpmn-designer-container-toolbar');
    const headerIcon = document.querySelector('.panel-header');
    if (panel?.classList.contains('panel-collapsed')) {
        panel.classList.remove('panel-collapsed');
        toolbar?.classList.remove('toolbar-width');
        switchPanel?.children[0].classList.remove('icon-collapsed');
        headerIcon?.children[0]?.classList.remove('panel-header-icon-hide');
        headerIcon?.children[0]?.classList.add('panel-header-icon');
        return false;
    } else {
        panel?.classList.add('panel-collapsed');
        toolbar?.classList.add('toolbar-width');
        switchPanel?.children[0].classList.add('icon-collapsed');
        headerIcon?.children[0].classList.remove('panel-header-icon');
        headerIcon?.children[0].classList.add('panel-header-icon-hide');
        return true;
    }
}
