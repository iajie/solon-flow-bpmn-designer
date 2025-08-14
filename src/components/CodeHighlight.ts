import highlight from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.min.css';

interface CodeHighlightProps {
    source: string;
    type: string;
}

export class CodeHighlight extends HTMLElement {

    props: CodeHighlightProps;

    constructor(props: CodeHighlightProps) {
        super();
        this.props = props;
    }

    connectedCallback() {
        this.classList.add('preview-content');
        const code = highlight.highlight(this.props.source, {
            language: this.props.type,
            ignoreIllegals: false
        });
        this.innerHTML = `<pre>${code.value}</pre>`;
    }
}
