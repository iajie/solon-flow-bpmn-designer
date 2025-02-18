import PaletteProvider, {
    Palette, Create, ElementFactory, SpaceTool, LassoTool,
    HandTool, GlobalConnect, Translate
} from 'bpmn-js/lib/features/palette/PaletteProvider';
import { createAction } from '../../utils/bpmnUtils.ts';

class EasyBpmnPaletteProvider extends PaletteProvider {
    private create: Create;
    private elementFactory: ElementFactory;
    private lassoTool: LassoTool;
    private handTool: HandTool;
    private globalConnect: GlobalConnect;
    private translate: Translate;
    constructor(
        palette: Palette, create: Create, elementFactory: ElementFactory,
        spaceTool: SpaceTool, lassoTool: LassoTool, handTool: HandTool,
        globalConnect: GlobalConnect, translate: Translate) {
        super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate);
        this.create = create;
        this.elementFactory = elementFactory;
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
                title: this.translate('Activate hand tool'),
                action: {
                    click: (event: any)=> {
                        this.handTool.activateHand(event)
                    },
                },
            },
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: this.translate('Activate lasso tool'),
                action: {
                    click: (event: MouseEvent)=> {
                        this.lassoTool.activateSelection(event)
                    },
                },
            },
            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: this.translate('Activate global connect tool'),
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
                this.translate('Create start event'),
            ),
            'create.end-event': createAction(
                this.elementFactory,
                this.create,
                'bpmn:EndEvent',
                'events',
                'bpmn-icon-end-event-none',
                this.translate('Create end event'),
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
                this.translate('Create gateway'),
            ),
            'create.parallel-gateway': createAction(
                this.elementFactory,
                this.create,
                'bpmn:ParallelGateway',
                'gateway',
                'bpmn-icon-gateway-parallel',
                this.translate('Parallel gateway'),
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
                this.translate('Create user task'),
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
                title: this.translate('Create expanded sub-process'),
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
    paletteProvider: ['type', EasyBpmnPaletteProvider],
};
