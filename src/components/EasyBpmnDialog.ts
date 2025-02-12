import '../stytles/index.css';

interface EasyBpmnDialogProps {
    content: string;
    title: string;
    isMask?: boolean;
    clickMaskClose?: boolean;
}

const defaultOptions: EasyBpmnDialogProps = {
    content: '',
    title: '',
    isMask: true,
    clickMaskClose: false
}

export class EasyBpmnDialog extends HTMLElement {

    private dialogId = 'easy-bpmn-preview-dialog-container';

    options: EasyBpmnDialogProps;

    constructor(options: EasyBpmnDialogProps) {
        super();
        this.options = { ...defaultOptions, ...options };
        this.connectedCallback();
    }

    connectedCallback() {
        const dialog = document.getElementById(this.dialogId);
        if (dialog) {
            dialog.remove();
        } else {
            let dialogContainer: string = `<div class="preview-dialog">
                    <div class="preview-header">
                        <span>${this.options.title}</span>
                        <span class="icon-close">
                            <svg t="1739262766708" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6771" width="200" height="200"><path d="M196.48 149.376L874.624 827.52l-47.104 47.104L149.376 196.48z" p-id="6772"></path><path d="M149.376 827.52L827.52 149.44l47.168 47.104L196.544 874.688z" p-id="6773"></path></svg>
                        </span>
                    </div>
                <div class="preview-content"></div>
            </div>`;
            if (this.options.isMask) {
                dialogContainer = `<div class="preview-mask" />${dialogContainer}`;
            }

            const el = document.createElement('div');
            el.id = this.dialogId;
            el.innerHTML = dialogContainer;
            document.body.appendChild(el);
            const content = document.querySelector('.preview-content');
            if (content) {
                content.innerHTML = this.options.content;
            }
            if (this.options.clickMaskClose) {
                const mask = document.querySelector('.preview-mask');
                if (mask) {
                    mask.addEventListener('click', () => this.onClose());
                }
            }

            const iconClose = document.querySelector('.icon-close');
            if (iconClose) {
                iconClose.addEventListener('click', () => this.onClose());
            }
        }
    }

    onClose() {
        const dialog = document.getElementById(this.dialogId);
        if (dialog) {
            dialog.remove();
        }
    }
}