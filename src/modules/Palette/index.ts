import PaletteProvider, {
    Palette, Create, ElementFactory, SpaceTool, LassoTool,
    HandTool, GlobalConnect, Translate
} from 'bpmn-js/lib/features/palette/PaletteProvider';
import { createAction } from '../../utils/bpmnUtils.ts';

class EasyFlowablePaletteProvider extends PaletteProvider {
    palette: Palette;
    create: Create;
    elementFactory: ElementFactory;
    spaceTool: SpaceTool;
    lassoTool: LassoTool;
    handTool: HandTool;
    globalConnect: GlobalConnect;
    translate: Translate;
    constructor(
        palette: Palette, create: Create, elementFactory: ElementFactory,
        spaceTool: SpaceTool, lassoTool: LassoTool, handTool: HandTool,
        globalConnect: GlobalConnect, translate: Translate) {
        super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate);
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.lassoTool = lassoTool;
        this.handTool = handTool;
        this.globalConnect = globalConnect;
        this.translate = translate;
    }
    getPaletteEntries() {
        const actions = {};

        const createSubprocess = (event: any) => {
            const subProcess = this.elementFactory.createShape({
                type: 'bpmn:SubProcess',
                x: 0,
                y: 0,
                isExpanded: true,
            })

            const startEvent = this.elementFactory.createShape({
                type: 'bpmn:StartEvent',
                x: 40,
                y: 82,
                parent: subProcess,
            })

            this.create.start(event, [subProcess, startEvent], {
                hints: {
                    autoSelect: [startEvent],
                },
            })
        }

        Object.assign(actions, {
            'hand-tool': {
                group: 'tools',
                className: 'bpmn-icon-hand-tool',
                title: '手型工具',
                action: {
                    click: (event: any)=> {
                        this.handTool.activateHand(event)
                    },
                },
            },
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: '套索工具',
                action: {
                    click: (event: MouseEvent)=> {
                        this.lassoTool.activateSelection(event)
                    },
                },
            },
            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: '全局连线',
                action: {
                    click: ()=> {
                        this.globalConnect.toggle()
                    },
                },
            },
            'tool-separator': {
                group: 'tools',
                separator: true,
            },
            'create.start-event': createAction(
                this.elementFactory,
                this.create,
                'bpmn:StartEvent',
                'events',
                'bpmn-icon-start-event-none',
                '开始事件',
            ),
            'create.end-event': createAction(
                this.elementFactory,
                this.create,
                'bpmn:EndEvent',
                'events',
                'bpmn-icon-end-event-none',
                '结束事件',
            ),
            'events-separator': {
                group: 'events',
                separator: true,
            },
            'create.exclusive-gateway': createAction(
                this.elementFactory,
                this.create,
                'bpmn:ExclusiveGateway',
                'gateway',
                'bpmn-icon-gateway-xor',
                '网关',
            ),
            'create.parallel-gateway': createAction(
                this.elementFactory,
                this.create,
                'bpmn:ParallelGateway',
                'gateway',
                'bpmn-icon-gateway-parallel',
                '并行网关',
            ),
            // 'create.event-base-gateway': createAction(
            //   elementFactory,
            //   create,
            //   'bpmn:EventBasedGateway',
            //   'gateway',
            //   'bpmn-icon-gateway-eventbased',
            //   '事件网关',
            // ),
            'gateway-separator': {
                group: 'gateway',
                separator: true,
            },
            'create.user-task': createAction(
                this.elementFactory,
                this.create,
                'bpmn:UserTask',
                'activity',
                'bpmn-icon-user-task',
                '用户任务',
            ),
            // 'create.script-task': createAction(
            //   elementFactory,
            //   create,
            //   'bpmn:ScriptTask',
            //   'activity',
            //   'bpmn-icon-script-task',
            //   '脚本任务',
            // ),
            // 'create.service-task': createAction(
            //   elementFactory,
            //   create,
            //   'bpmn:ServiceTask',
            //   'activity',
            //   'bpmn-icon-service-task',
            //   '服务任务',
            // ),
            'create.subprocess-expanded': {
                group: 'activity',
                className: 'bpmn-icon-subprocess-expanded',
                title: '子流程',
                action: {
                    dragstart: createSubprocess,
                    click: createSubprocess,
                },
            },
        })

        return actions
    }

}

export const EasyBpmnDesignerPalette = {
    paletteProvider: ['type', EasyFlowablePaletteProvider],
};
