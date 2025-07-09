import ReplaceMenuProvider, {
    BpmnFactory, BpmnReplace, Moddle, ModdleCopy, Modeling, PopupMenu, Rules, Translate, Element
} from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import * as replaceOptions from "bpmn-js/lib/features/replace/ReplaceOptions";
import {TargetElement} from "bpmn-js/lib/features/replace/BpmnReplace";
import {isType} from "../../utils/bpmnUtils.ts";
type ReplaceOption = import("bpmn-js/lib/features/replace/ReplaceOptions").ReplaceOption;

class EasyBpmnPopupMenuProvider extends ReplaceMenuProvider {

    private readonly translate: Translate;
    private bpmnReplace: BpmnReplace;

    constructor(bpmnFactory: BpmnFactory, popupMenu: PopupMenu, modeling: Modeling, moddle: Moddle,
                bpmnReplace: BpmnReplace, rules: Rules, translate: Translate, moddleCopy: ModdleCopy) {
        super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate, moddleCopy);
        this.translate = translate;
        this.bpmnReplace = bpmnReplace;
    }

    createEntry(replaceOption: ReplaceOption, target: Element) {
        const replaceElement = this.bpmnReplace.replaceElement;
        const action = () => {
            return replaceElement(target, replaceOption.target as TargetElement);
        }
        return {
            label: this.translate(replaceOption.label as string),
            className: replaceOption.className,
            action
        };
    }

    createEntries(target: Element, replaceOptions: ReplaceOption[]) {
        const entries: any = {};
        replaceOptions.forEach(item => {
            entries[item.actionName] = this.createEntry(item, target);
        });
        return entries;
    }

    getPopupMenuEntries(target: Element) {
        if (target.type.endsWith('Gateway')) {
            // 只有网关才会切换属性
            const options= replaceOptions.GATEWAY.filter(item => {
                return item.label !== "Event-based gateway" && item.label !== "Complex gateway" && item.target?.type !== target.type;
            });
            return this.createEntries(target, options);
        }
        // 用户任务可切换为子程序
        if (isType(target.type, "bpmn:UserTask")) {
            const options = replaceOptions.TRANSACTION.filter(item => {
                return item.target?.type === "bpmn:SubProcess" && !item.target.triggeredByEvent;
            });
            return this.createEntries(target, options);
        }
        if (isType(target.type, "bpmn:SubProcess")) {
            if (!target.collapsed) {
                return this.createEntries(target, replaceOptions.TASK.filter(item => {
                    return item.target?.type === "bpmn:SubProcess" && !item.target.triggeredByEvent && !item.target.isExpanded;
                }))
            }
            return this.createEntries(target, replaceOptions.TASK.filter(item => {
                return item.target?.type === "bpmn:SubProcess" && !item.target.triggeredByEvent && item.target.isExpanded;
            }))
        }
        return {};
    }

    /**
     * 多实例面板头部
     * @returns
     */
    _getLoopCharacteristicsHeaderEntries = () => {
        return {};
    }

}

export const EasyBpmnDesignerPopupMenu = {
    __init__: ['paletteProvider'],
    replaceMenuProvider: ['type', EasyBpmnPopupMenuProvider]
};
