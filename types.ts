
export type MachineState = 'normal' | 'reverse' | 'moving_to_normal' | 'moving_to_reverse' | 'failure';

export interface CircuitNode {
  id: string;
  name: string;
  connected: boolean;
  type: 'contact' | 'relay';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StepInfo {
  title: string;
  desc: string;
}
