import ReplaceMenuProvider, {
    BpmnFactory, BpmnReplace, Moddle, ModdleCopy, Modeling, PopupMenu, Rules, Translate, Element
} from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import * as replaceOptions from "bpmn-js/lib/features/replace/ReplaceOptions";
import {TargetElement} from "bpmn-js/lib/features/replace/BpmnReplace";
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
        if (!target.type.endsWith('Gateway')) {
            return {};
        }
        // 只有网关才会切换属性
        const options= replaceOptions.GATEWAY.filter(item => {
            item.label = this.translate(item.label as string);
            return item.label !== "Event-based gateway" && item.label !== "Complex gateway" && item.target?.type !== target.type;
        });
        return this.createEntries(target, options);
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
