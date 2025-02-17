import {AbstractToolBar} from "../AbstractToolBar.ts";

export class Import extends AbstractToolBar {

    constructor() {
        super();
        this.template = `<div>
            <input type="file" id="easy-bpmn-designer-import" accept=".xml" style="display: none" />
            <svg t="1739773124438" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13251" width="200" height="200"><path d="M888.32 757.376h-53.76a7.744 7.744 0 0 0-7.744 7.68v61.824h-629.76V197.12h629.824v61.76c0 4.224 3.52 7.68 7.68 7.68h53.824a7.68 7.68 0 0 0 7.68-7.68V158.72a30.656 30.656 0 0 0-30.72-30.72H158.72a30.656 30.656 0 0 0-30.72 30.72v706.56c0 17.024 13.696 30.72 30.72 30.72h706.56c17.024 0 30.72-13.696 30.72-30.72v-100.16a7.68 7.68 0 0 0-7.68-7.68z m13.696-281.344H588.032V400a8 8 0 0 0-13.056-6.272l-141.888 112a8 8 0 0 0 0 12.544l141.888 112a8 8 0 0 0 13.056-6.272V547.968h313.984a8 8 0 0 0 8-7.936v-56.064a8 8 0 0 0-8-8z" fill="#2D3040" p-id="13252"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    async handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            try {
                const text = await file.text();
                // 导入到画布
                await this.modeler?.importXML(text);
            } catch (error) {
                if (this.options?.onXmlError) {
                    this.options?.onXmlError(error as Error);
                }
            } finally {
                target.value = ""; // 清空input，允许重复选择同一文件
            }
        }
    };

    onClick() {
        const fileInput = document.getElementById('easy-bpmn-designer-import');
        if (fileInput) {
            fileInput.click();
            fileInput.onchange = this.handleFileChange;
        }
    }
}