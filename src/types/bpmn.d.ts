declare module 'bpmn-js' {

    export type Canvas = import('diagram-js/lib/core/Canvas').default;
    export type ElementRegistry = import('diagram-js/lib/core/ElementRegistry').default;
    export type ElementFactory = import("diagram-js/lib/core/ElementFactory").default;
    export type EventBus = import("diagram-js/lib/core/EventBus").default;
    export type Connect = import("diagram-js/lib/features/connect/Connect").default;
    export type Create = import("diagram-js/lib/features/create/Create").default;
    export type PopupMenu = import("diagram-js/lib/features/popup-menu/PopupMenu").default;
    export type Rules = import("diagram-js/lib/features/rules/Rules").default;
    export type Translate = typeof import("diagram-js/lib/i18n/translate/translate").default;
    export type Element = import("bpmn-js/lib/model/Types").Element;
    export type Shape = import("bpmn-js/lib/model/Types").Shape;
    export type Modeling = import("bpmn-js/lib/features/modeling/Modeling").default;
    export type Injector = import("didi").Injector;
    export type ModuleDeclaration = import("didi").ModuleDeclaration;
    export type ContextPad = import("diagram-js/lib/features/context-pad/ContextPad").default;
    export type AppendPreview = import("bpmn-js/lib/features/append-preview/AppendPreview").default;

    export type BpmnFactory = import("bpmn-js/lib/features/modeling/BpmnFactory").default;
    export type BpmnReplace = import("bpmn-js/lib/features/replace/BpmnReplace").default;
    export type Moddle = import("bpmn-js/lib/model/Types").Moddle;
    export type ModdleCopy = import("bpmn-js/lib/features/copy-paste/ModdleCopy").default;

    export type Palette = import("diagram-js/lib/features/palette/Palette").default;
    export type SpaceTool = import("bpmn-js/lib/features/space-tool/BpmnSpaceTool").default;
    export type LassoTool = import("diagram-js/lib/features/lasso-tool/LassoTool").default;
    export type HandTool = import("diagram-js/lib/features/hand-tool/HandTool").default;
    export type GlobalConnect = import("diagram-js/lib/features/global-connect/GlobalConnect").default;

    export interface BpmnJSOptions {
        container: HTMLElement | string;
        width?: string | number;
        height?: string | number;
        position?: 'absolute';
        additionalModules?: BpmnJSModule[];
        moddleExtensions?: Record<string, any>;
    }

    export interface Selection {
        get(): Array<any>;
    }

    export type CommandStack = import('diagram-js/lib/command/CommandStack').default;

    export interface Clipboard {
        isEmpty(): boolean;

        copy(elements: Array<any>): void;

        paste(): void;
    }

    export interface BpmnElement {
        id: string;
        type: string;
        businessObject: {
            $type: string;
            id: string;
            name?: string;
            documentation?: Array<{ text: string }>;
            formKey?: string;
            candidateUsers?: string;
            candidateGroups?: string;
            conditionExpression?: { body: string };
            assignee?: string;
            dueDate?: string;
            priority?: string;
            [key: string]: any;
        };
        width?: number;
        height?: number;
        x?: number;
        y?: number;
    }

    export class Viewer {
        constructor(options?: ViewerConstructorOptions);

        importXML(xml: string): Promise<{ warnings: Array<any> }>;

        saveXML(options?: { format?: boolean }): Promise<{ xml: string }>;

        destroy(): void;

        on(event: string, callback: Function): void;

        off(event: string, callback: Function): void;

        get(moduleName: 'canvas'): Canvas;
        get(moduleName: string): any;
    }

    export interface Modeler {
        get(name: 'canvas'): Canvas;

        get(name: 'modeling'): Modeling;

        get(name: 'elementRegistry'): ElementRegistry;

        get(name: 'selection'): Selection;

        get(name: 'commandStack'): CommandStack;

        get(name: 'clipboard'): Clipboard;

        get(name: 'bpmnFactory'): ElementFactory;

        get(name: 'alignElements'): AlignElements;

        get(name: string): any;

        on(event: 'selection.changed', callback: (context: { newSelection: BpmnElement[] }) => void): void;

        on(event: 'commandStack.changed', callback: () => void): void;

        on(event: 'shape.added', callback: (context: { element: BpmnElement }) => void): void;

        on(event: 'connection.added', callback: (context: { element: BpmnElement }) => void): void;

        on(event: string, callback: Function): void;

        off(event: string, callback: Function): void;

        destroy(): void;

        importXML(xml: string): Promise<{ warnings: Array<any> }>;

        saveXML(options?: { format?: boolean }): Promise<{ xml: string }>;
    }

    export interface AlignElements {
        trigger(elements: BpmnElement[], type: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle'): void;
    }
}

declare module 'bpmn-js/lib/Viewer' {
    import {Viewer} from 'bpmn-js';
    export = Viewer;
}

export type {Canvas, Modeling, Selection, Clipboard, CommandStack,
    BpmnElement, Modeler, Element, Shape, ElementFactory,
    Create, Connect, ContextPad, EventBus, Injector, Palette, PopupMenu, BpmnFactory, Rules, Translate,
    Moddle, ModdleCopy, BpmnReplace, ElementRegistry, AppendPreview, SpaceTool, HandTool, LassoTool, GlobalConnect,
    ModuleDeclaration
} from 'bpmn-js';
