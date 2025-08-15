import highlight from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.min.css';

interface CodeHighlightProps {
    source: string;
}

export class CodeHighlight extends HTMLElement {

    props: CodeHighlightProps;

    constructor(props: CodeHighlightProps) {
        super();
        this.props = props;
        this.connectedCallback();
    }

    connectedCallback() {
        this.classList.add('preview-content');
        let code: any = highlight.highlightAuto(this.props.source);
        this.innerHTML = `<pre>${code.value}</pre>`;
    }
}
