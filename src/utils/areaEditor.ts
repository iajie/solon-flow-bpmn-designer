interface IndentType {
    type: 'space' | 'tab';
    count: number;
}

interface Options {
    indentType?: IndentType;
}
/**
 * Main constructor
 * @param {HTMLElement|string} Textarea Element or Textarea  Selector
 * @param {Object} Options Configuration Item
 */
export class AreaEditor {
    element!: HTMLTextAreaElement;
    indentType!: IndentType;
    isPreventAuto!: boolean;
    isPreventKEY!: string[];
    beforeEnterScrollTop!: number;
    tabChar!: string;
    tabLength!: number;
    constructor(element: HTMLTextAreaElement | string, options: Options = {indentType : { type: 'space', count: 4 }}) {
        if (!(this instanceof AreaEditor)) {
            return new AreaEditor(element, options);
        }
        this.element = typeof element === 'string' ? document.querySelector(element) as HTMLTextAreaElement : element;
        this.indentType = options.indentType || { type: 'space', count: 4 };
        this.isPreventAuto = false;
        this.isPreventKEY = ['Backspace', 'Delete', 'Meta', 'Control', 'Ctrl'];
        this.beforeEnterScrollTop = 0;
        this.tabChar = '';
        this.tabLength = 0;
        this.init();
    }

    // Initialization
    init(): void {
        this.setupEvents(this.element as HTMLTextAreaElement);
    }

    // Set event listener
    setupEvents(element: HTMLTextAreaElement): void {
        element.addEventListener('keydown', this.onKeyDown.bind(this));
        element.addEventListener('input', this.onInput.bind(this));
        element.addEventListener('paste', this.onPaste.bind(this));
        element.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyUp(e: KeyboardEvent): void {
        if (this.isPreventKEY.includes(e.key)) {
            this.isPreventAuto = false;
        }
    }

    onPaste(_: ClipboardEvent): void {
        this.isPreventAuto = true;
    }

    onInput(e: Event): void {
        const target = e.target as HTMLTextAreaElement;
        if (this.isPreventAuto) {
            this.isPreventAuto = false;
            return;
        }

        const start = target.selectionStart;
        const end = target.selectionEnd;
        const value = target.value;
        if (start === null || end === null) return;

        const nextChar = value[start];
        const lastChar = value[start - 1];
        const secondLastChar = value[start - 2];

        // Autocomplete brackets
        const autoPairs: Record<string, string> = {
            '{': '}',
            '[': ']',
            '(': ')',
            '"': '"',
            "'": "'",
            '`': '`',
        };
        if (['{', '(', '[', '"', "'", '`', ']', '}', ')'].includes(lastChar) && start === end) {
            if (this.isPreventAuto) {
                this.isPreventAuto = false;
                return;
            }
            const pairChar = autoPairs[lastChar]  || '';
            for (const leftBrace in autoPairs) {
                if (leftBrace === secondLastChar && autoPairs[leftBrace] === lastChar && nextChar === lastChar) {  // If the user still chooses to manually complete it, it should be ignored.
                    target.value = value.substring(0, start) + value.substring(start + 1);
                    target.selectionStart = target.selectionEnd = start;
                    return;
                }
            }
            target.value = value.substring(0, start) + pairChar + value.substring(start);
            target.selectionStart = target.selectionEnd = start;
        }

        // Line break processing
        if (lastChar === '\n') {
            const lineStart = value.lastIndexOf('\n', start - 2) + 1;
            const currentLine = value.substring(lineStart, start - 1);
            const indent = currentLine.match(/^\s*/)?.[0] || '';
            let newText: string;
            const pairs: Record<string, string> = {
                '{': '}',
                '[': ']',
                '(': ')',
                '<': '>',
                '>': '<',
            };
            const trimmedLine = currentLine.trim();
            const lastTrimmedChar = trimmedLine.slice(-1);
            if (pairs[lastTrimmedChar]) {  // If the current character is open brackets
                if (nextChar === pairs[lastTrimmedChar]) {  // The next character is closed brackets
                    newText = '\n' + indent + this.tabChar + '\n' + indent;
                } else {
                    newText = '\n' + indent + ((lastTrimmedChar !== '>') ? (this.tabChar) : '') ;
                }
                target.value = value.substring(0, start - 1) + newText + value.substring(end - 1).replace(/\n/, '');
                target.selectionStart = target.selectionEnd = start - 1 +
                    indent.length +
                    ((lastTrimmedChar !== '>') || nextChar === pairs[lastTrimmedChar] ? (1 + this.tabLength) : 1);
            } else {
                newText = '\n' + indent;
                target.value = value.substring(0, start - 1) + newText + value.substring(end - 1).replace(/\n/, '');
                target.selectionStart = target.selectionEnd = start - 1 + newText.length;
            }
            if (this.beforeEnterScrollTop) {
                target.scrollTop = this.beforeEnterScrollTop;
                this.beforeEnterScrollTop = 0;
            }
            return;
        }
    }

    onKeyDown(e: KeyboardEvent): void {
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        if (start === null || end === null) return;
        const value = target.value;

        this.tabChar = (this.indentType.type === 'tab') ? '\t' : Array(this.indentType.count + 1).join(' ');  // Indented characters
        this.tabLength = this.indentType.count;  // The length of indented characters

        if (this.isPreventKEY.includes(e.key)) {
            this.isPreventAuto = true;
        }

        // TAB
        if (e.key === 'Tab') {
            e.preventDefault();
            if (start === end) {  // No characters are selected in the cursor
                target.value = value.substring(0, start) + this.tabChar + value.substring(end);
                target.selectionStart = target.selectionEnd = start + this.tabLength;
                return;
            } else {
                const contentArr = value.split('\n');
                const contentArrOriginal = value.split('\n');
                const startLine = (value.substring(0, start).match(/\n/g) || []).length;
                const endLine = (value.substring(0, end).match(/\n/g) || []).length;
                if (e.shiftKey) {  // If Shift is pressed (remove indentation)
                    for (let _i = startLine; _i <= endLine; _i++) {
                        contentArr[_i] = this._removeLeadingSpaces(contentArr[_i], this.tabLength);
                    }
                    target.value = contentArr.join('\n');
                    const lengthDiff = contentArrOriginal[startLine].length - contentArrOriginal[startLine].trimStart().length; // How many indents are there in the *start* line
                    const moveLength = Math.min(this.tabLength, lengthDiff);
                    const limitLineNum = this._arrSum(contentArr, startLine); // Prevent cursor from deforming after deletion
                    const startPoint = limitLineNum > start - moveLength - startLine ? limitLineNum + startLine : start - moveLength; // If the indented area is selected on the left
                    target.selectionStart = lengthDiff > 0 ? startPoint : start;
                    target.selectionEnd = end - (contentArrOriginal.join('\n').length - target.value.length);
                } else {  // Only the Tab (increase indentation)
                    for (let _i = startLine; _i <= endLine; _i++) {
                        contentArr[_i] = this.tabChar + contentArr[_i];
                    }
                    target.value = contentArr.join('\n');
                    target.selectionStart = start + this.tabLength;
                    target.selectionEnd = end + this.tabLength * (startLine === endLine ? 1 : endLine - startLine + 1);
                }
            }
        }

        if (e.key === 'Backspace') {
            const contentArr = value.split('\n');
            const startLine = (value.substring(0, start).match(/\n/g) || []).length;
            if (start === end && (/^[\s\t]*$/.test(contentArr[startLine]) && contentArr[startLine] !== '')) {  // The current line contains only ' ' and '\t'
                target.selectionStart = this._arrSum(contentArr, startLine) + startLine;
                target.selectionEnd = start;
            }
        }

        if (e.key === 'Enter') {  // Record scrollbar height, to prevent screen jumping after pressing Enter
            this.beforeEnterScrollTop = target.scrollTop;
        }
    }

    // Delete n characters in the indented part of the string
    _removeLeadingSpaces(str: string, n: number): string {
        const regex = new RegExp(`^([ \\t]{0,${n}})`);
        return str.replace(regex, '');
    }

    // Sum of the lengths of `n` elements before the array
    _arrSum(a: string[], n: number, s: number = 0): number {
        a.slice(0, n).forEach((x) => {
            s += x.length;
        });
        return s;
    }
}
