import {EasyBpmnDesignerOptions} from "../../types/easy-bpmn-designer.ts";

export const defaultPanelKeys: EasyBpmnDesignerOptions['panelTabs'] = [{
    title: 'basic',
    key: 'basic',
    group: [
        {
            title: 'basic',
            items: [],
            easy: ['id', 'name'],
        },
        {
            title: 'china',
            items: [],
            easy: ['driver', 'meta'],
            show: "Process"
        },
        {
            title: 'china',
            items: [],
            easy: ['when', 'task', 'meta'],
            show: "UserTask"
        },
        {
            title: 'conditionProps',
            items: [],
            easy: ['condition-type', 'condition-expression'],
            show: 'SequenceFlow',
        },
    ]
}];
