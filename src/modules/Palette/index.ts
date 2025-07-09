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
        })

        return actions
    }

}

export const EasyBpmnDesignerPalette = {
    paletteProvider: ['type', EasyBpmnPaletteProvider],
};
