import React from "react";
import { SolonFlowBpmnDesigner } from "solon-flow-bpmn-designer";
import "solon-flow-bpmn-designer/style.css";

interface SolonFlowDesignerProps {
    value: string;
    theme?: "light" | "dark";
    lang?: "en" | "zh";
    type?: "yaml" | "json";
    height?: number;
    onChange?: (value: string) => void;
}

export interface SolonFlowDesignerRef {
    /**
     * 属性面板显隐控制
     */
    panelShow: () => boolean;
    /**
     * 清除设计器
     */
    clear: () => void;
    /**
     * 获取值
     */
    getValue: () => string | undefined;
}

const SolonFlowDesigner = React.forwardRef<SolonFlowDesignerRef, SolonFlowDesignerProps>((props, ref) => {
    const designerRef = React.useRef(null);
    const [designer, setDesigner] = React.useState<SolonFlowBpmnDesigner>();

    React.useImperativeHandle(ref, () => ({
        panelShow: () => designer?.showPanel() || false,
        clear: () => designer?.clear(),
        getValue: () => designer?.getValue(),
    }));

    React.useEffect(() => {
        if (!!designerRef.current) {
            if (designer) return;
            const solonFlowBpmnDesigner = new SolonFlowBpmnDesigner({
                container: designerRef.current,
                height: props.height || 60,
                lang: props.lang || 'zh',
                theme: props.theme || 'light',
                value: props.value,
                onChange: (callback) => {
                    props.onChange?.(callback(props.type || 'yaml'));
                },
            });
            setDesigner(solonFlowBpmnDesigner);
            return () => solonFlowBpmnDesigner.destroy();
        }
    }, []);

    React.useEffect(() => {
        if (designer) {
            designer.changeLocal(props.lang || 'cn');
        }
    }, [props.lang]);

    React.useEffect(() => {
        if (designer) {
            designer.changeTheme();
        }
    }, [props.theme]);

    return <div ref={designerRef}/>
});

export default SolonFlowDesigner;
