declare module 'bpmn-js' {
  export interface BpmnJSModule {}

  export interface Canvas {
    zoom(scale: number | 'fit-viewport'): void;
    zoom(): number;
    getDefaultLayer(): any;
    viewbox(viewbox?: { x: number; y: number; width: number; height: number }): any;
    getContainer(): HTMLElement;
  }

  export interface BpmnJSOptions {
    container: HTMLElement | string;
    width?: string | number;
    height?: string | number;
    position?: 'absolute';
    additionalModules?: BpmnJSModule[];
    moddleExtensions?: Record<string, any>;
  }

  export interface EventBus {
    on(event: string, callback: Function, priority?: number): void;
    off(event: string, callback: Function): void;
  }

  export interface Modeling {
    removeElements(elements: Array<any>): void;
    updateProperties(element: any, properties: Record<string, any>): void;
    createShape(shape: any, position: { x: number; y: number }, parent: any): any;
    createConnection(connection: any, source: any, target: any, parent: any): any;
    appendShape(source: any, shape: any, position: { x: number; y: number }): any;
  }

  export interface Selection {
    get(): Array<any>;
  }

  export interface ElementRegistry {
    get(id: string): any;
  }

  export interface CommandStack {
    canUndo(): boolean
    canRedo(): boolean
    undo(): void
    redo(): void
  }

  export interface Clipboard {
    isEmpty(): boolean;
    copy(elements: Array<any>): void;
    paste(): void;
  }

  export interface ModelerConstructorOptions extends BpmnJSOptions {
    keyboard?: {
      bindTo: Document | null;
    };
  }

  export interface ViewerConstructorOptions extends BpmnJSOptions {}

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

  export interface BpmnFactory {
    create(type: string, properties?: Record<string, any>): any;
  }

  export interface Palette {
    open(): void;
    close(): void;
  }

  export default class BpmnModeler extends Modeler {}

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
    get(name: 'bpmnFactory'): BpmnFactory;
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

  export default Modeler;
}

declare module 'bpmn-js/lib/Viewer' {
  import { Viewer } from 'bpmn-js';
  export = Viewer;
}

export interface BpmnModeler {
  get(name: string): any;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  destroy(): void;
  importXML(xml: string): Promise<{ warnings: Array<any> }>;
  saveXML(): Promise<{ xml: string }>;
}

export type { Canvas, Modeling, Selection, Clipboard, CommandStack,BpmnElement, Modeler } from 'bpmn-js'; 
