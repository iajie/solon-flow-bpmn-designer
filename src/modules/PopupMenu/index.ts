import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import ReplaceMenuProvider, {
    BpmnFactory, BpmnReplace, Moddle, ModdleCopy, Modeling, PopupMenu,
    Rules, Translate, Element, PopupMenuEntries
} from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import { isDifferentType, PopupMenuTarget } from "bpmn-js/lib/features/popup-menu/util/TypeUtil";
import { filter, forEach, isArray } from "min-dash";
import * as replaceOptions from "bpmn-js/lib/features/replace/ReplaceOptions";
import { isEventSubProcess, isExpanded } from "bpmn-js/lib/util/DiUtil";
import { BpmnElement } from "bpmn-js";
import { ReplaceOption } from "bpmn-js/lib/features/replace/ReplaceOptions";

type ElementTarget = PopupMenuTarget & BpmnElement & any;

class EasyBpmnPopupMenuProvider extends ReplaceMenuProvider {

    private modeling: Modeling;
    private moddle: Moddle;
    private translate: Translate;
    private moddleCopy: ModdleCopy;
    private bpmnReplace: BpmnReplace;
    private rules: Rules;
    constructor(bpmnFactory: BpmnFactory, popupMenu: PopupMenu, modeling: Modeling, moddle: Moddle,
                bpmnReplace: BpmnReplace, rules: Rules, translate: Translate, moddleCopy: ModdleCopy) {
        super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate, moddleCopy);
        this.modeling = modeling;
        this.moddle = moddle;
        this.translate = translate;
        this.moddleCopy = moddleCopy;
        this.rules = rules;
        this.bpmnReplace = bpmnReplace;
    }

    /**
     * 多实例面板头部
     * @param target
     * @returns
     */
    _getLoopCharacteristicsHeaderEntries = (target: Element) => {
        // 只有用户任务支持多实例
        if (target.type !== 'bpmn:UserTask') {
            // 如果不是用户任务，则删除多实例元素图标
            this.modeling.updateProperties(target, { loopCharacteristics: undefined });
            return {};
        }
        // 多实例图标点击事件
        const toggleLoopEntry = (_event: any, entry: Element) => {
            // remove
            if (entry.active) {
                this.modeling.updateProperties(target, { loopCharacteristics: undefined });
                return;
            }
            const currentLoopCharacteristics = target.businessObject.get('loopCharacteristics'), newLoopCharacteristics = this.moddle.create(entry.options.loopCharacteristics);
            // copy old properties
            if (currentLoopCharacteristics) {
                this.moddleCopy.copyElement(currentLoopCharacteristics, newLoopCharacteristics);
            }
            // update `isSequential` property
            newLoopCharacteristics.set('isSequential', entry.options.isSequential);
            this.modeling.updateProperties(target, { loopCharacteristics: newLoopCharacteristics });
        }
        const businessObject = getBusinessObject(target), loopCharacteristics = businessObject.loopCharacteristics;
        let isSequential, isParallel;
        if (loopCharacteristics) {
            isSequential = loopCharacteristics.isSequential;
            isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential;
        }
        return {
            'toggle-parallel-mi': {
                className: 'bpmn-icon-parallel-mi-marker',
                title: this.translate('Parallel multi-instance'),
                active: isParallel,
                action: toggleLoopEntry,
                options: {
                    loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
                    isSequential: false
                }
            },
            'toggle-sequential-mi': {
                className: 'bpmn-icon-sequential-mi-marker',
                title: this.translate('Sequential multi-instance'),
                active: isSequential,
                action: toggleLoopEntry,
                options: {
                    loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
                    isSequential: true
                }
            },
            // 'toggle-loop': {
            //     className: 'bpmn-icon-loop-marker',
            //     title: this.translate('Loop'),
            //     active: isLoop,
            //     action: toggleLoopEntry,
            //     options: {
            //         loopCharacteristics: 'bpmn:StandardLoopCharacteristics'
            //     }
            // }
        };
    }

    private createEntries(element: ElementTarget, replaceOptions: ReplaceOption[]) {
        const entries: any = {};
        replaceOptions.forEach((replaceOption) => {
            entries[replaceOption.actionName] = this.createEntry(replaceOption, element);
        });
        return entries;
    }

    private createEntry(replaceOption: ReplaceOption, element: ElementTarget, action?: any) {
        const replaceAction = () => this.bpmnReplace.replaceElement(element, replaceOption);
        let label = replaceOption.label;
        if (label && typeof label === 'function') {
            label = () => element;
        }
        action = action || replaceAction;
        return {
            label: this.translate(label),
            className: replaceOption.className,
            action: action
        };
    }

}

export const EasyBpmnDesignerPopupMenu = {
    __init__: ['paletteProvider'],
    replaceMenuProvider: ['type', EasyBpmnPopupMenuProvider]
};