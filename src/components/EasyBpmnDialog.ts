import '../styles/index.css';
import {AreaEditor} from '../utils/areaEditor'

interface EasyBpmnDialogProps {
    content: string;
    title: string;
    edit?: boolean;
    text?: string;
    isMask?: boolean;
    clickMaskClose?: boolean;
}

const defaultOptions: EasyBpmnDialogProps = {
    content: '',
    title: '',
    edit: false,
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
        }
        let dialogContainer: string = `<div class="preview-dialog">
                <div class="preview-header">
                    <span>${this.options.title}</span>
                    <span class="icon-close">
                        <svg t="1739262766708" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6771" width="200" height="200"><path d="M196.48 149.376L874.624 827.52l-47.104 47.104L149.376 196.48z" p-id="6772"></path><path d="M149.376 827.52L827.52 149.44l47.168 47.104L196.544 874.688z" p-id="6773"></path></svg>
                    </span>
                </div>
            ${this.options.edit ? `` : `<div class="preview-content"></div>`}
        </div>`;
        if (this.options.isMask) {
            dialogContainer = `<div class="preview-mask" />${dialogContainer}`;
        }
        const el = document.createElement('div');
        el.id = this.dialogId;
        el.innerHTML = dialogContainer;
        if (this.options.edit) {
            const dialog = el.querySelector('.preview-dialog');
            if (dialog) {
                const textarea = document.createElement('textarea');
                new AreaEditor(textarea);
                textarea.value = this.options.content;
                textarea.addEventListener('input', () => {
                    this.dispatchEvent(new CustomEvent('code-edit', { detail: textarea.value }));
                });
                dialog.appendChild(textarea);
            }
        } else {
            const previewHeader = el.querySelector('.preview-header');
            if (previewHeader) {
                const span = document.createElement("span");
                span.innerHTML = `<svg t="1752146618982" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8895" width="16" height="16"><path d="M763.392 543.744h-157.184V386.048a31.744 31.744 0 1 0-62.976 0v157.696H385.536a31.744 31.744 0 0 0 0 62.976h157.696v157.696a31.744 31.744 0 0 0 62.976 0v-157.696h157.696a31.744 31.744 0 0 0 0-62.976z" fill="" p-id="8896"></path><path d="M802.816 240.128H348.16a113.664 113.664 0 0 0-113.664 113.664v454.144A113.664 113.664 0 0 0 348.16 921.6h454.144a113.664 113.664 0 0 0 113.664-113.664V353.792a113.664 113.664 0 0 0-113.152-113.664zM870.4 807.936a68.096 68.096 0 0 1-68.096 68.096H348.16a68.096 68.096 0 0 1-68.096-68.096V353.792A68.096 68.096 0 0 1 348.16 285.696h454.144A68.096 68.096 0 0 1 870.4 353.792z" fill="" p-id="8897"></path><path d="M699.904 162.816a25.6 25.6 0 0 0 0-51.2H245.248A139.264 139.264 0 0 0 106.496 250.88v454.144a25.6 25.6 0 0 0 51.2 0V250.88a88.064 88.064 0 0 1 87.552-88.064z" fill="" p-id="8898"></path></svg>`;
                span.addEventListener('click', (_) => {
                    navigator.clipboard.writeText(this.options.text || '');
                })
                previewHeader.children[0].appendChild(span);
            }
        }
        const dom = document.querySelector('.easy-bpmn-designer-container');
        if (dom) {
            dom.appendChild(el);
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
