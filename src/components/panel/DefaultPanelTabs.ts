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
            title: 'formProps',
            items: [],
            easy: ['form-primary-key', 'allow-editing'],
            show: 'UserTask',
        },
        {
            title: 'conditionProps',
            items: [],
            easy: ['condition-expression'],
            show: 'Gateway',
        },
        {
            title: 'multiInstanceProps',
            items: [],
            easy: ['multi-instance', 'loop-cardinality', 'completion-condition'],
            show: 'UserTask',
        },
        {
            title: 'conditionProps',
            items: [],
            easy: ['condition-type', 'condition-expression'],
            show: 'SequenceFlow',
        },
        {
            title: 'timeoutProps',
            items: [],
            // easy: ['timeout', 'timeoutStrategy'],
            show: 'UserTask',
        },
        {
            title: 'advancedProps',
            items: [],
            // easy: ['assigneeEmpty', 'returnSetting'],
            show: 'UserTask',
        },
    ]
}, {
    title: 'assignee',
    key: 'assignee',
    group: [
        {
            title: 'assigneeProps',
            items: [],
            // easy: ['assignee', 'candidateUsers', 'candidateGroups'],
            show: 'UserTask',
        }
    ]
}, {
    title: 'buttons',
    key: 'buttons',
    group: [
        {
            title: 'buttonProps',
            items: [],
            // easy: ['availableButtons'],
            show: 'UserTask',
        },
        {
            title: 'buttonAuto',
            items: [],
            // easy: ['starter', 'lastHandler', 'approved'],
            show: 'UserTask',
        },
    ]
}];