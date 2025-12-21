import { SolonFlowBpmnDesignerOptions } from "../../core";

export const defaultPanelKeys: SolonFlowBpmnDesignerOptions['panelTabs'] = [{
    title: 'basic',
    key: 'basic',
    group: [
        {
            title: 'basic',
            easy: ['id', 'name'],
        },
        {
            title: 'china',
            easy: ['driver', 'meta'],
            show: "Process"
        },
        {
            title: 'china',
            easy: ['when', 'task', 'meta'],
            show: "UserTask"
        },
        {
            title: 'china',
            easy: ['meta'],
            show: "ComplexGateway"
        },
        {
            title: 'conditionProps',
            easy: ['condition-type', 'condition-expression'],
            show: 'SequenceFlow',
        },
        {
            title: 'extendedAttributes',
            easy: ['extend'],
            show: 'UserTask'
        }
    ]
}];
