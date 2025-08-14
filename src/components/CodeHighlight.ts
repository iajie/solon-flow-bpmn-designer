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
        this.connectedCallback();
    }

    connectedCallback() {
        this.classList.add('preview-content');
        let code: any;
        if (this.props.type === 'auto') {
            code = highlight.highlightAuto(this.props.source);
        } else {
            code = highlight.highlight(this.props.source, {
                language: this.props.type,
            });
        }
        this.innerHTML = `<pre>${code.value}</pre>`;
    }
}
