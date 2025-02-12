declare module 'bpmn-js-token-simulation' {
  const TokenSimulationModule: any;
  export default TokenSimulationModule;
}

declare module 'bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode' {
  export default class ToggleMode {
    toggleMode(): void;
  }
} 