import { create } from 'zustand';

export type PreflightMethodStatus = 'pass' | 'fail' | 'skipped';

export interface PreflightMethodResult {
  method: string;
  status: PreflightMethodStatus;
  error?: string;
}

export interface PreflightState {
  status: 'idle' | 'running' | 'complete' | 'skipped';
  timestamp?: number;
  actorAvailable: boolean;
  results: PreflightMethodResult[];
}

interface PreflightDiagnosticsStore {
  state: PreflightState;
  setRunning: () => void;
  setSkipped: () => void;
  setComplete: (results: PreflightMethodResult[]) => void;
  reset: () => void;
}

const initialState: PreflightState = {
  status: 'idle',
  actorAvailable: false,
  results: [],
};

export const usePreflightDiagnosticsStore = create<PreflightDiagnosticsStore>((set) => ({
  state: initialState,
  
  setRunning: () => set((state) => ({
    state: {
      ...state.state,
      status: 'running',
      timestamp: Date.now(),
      actorAvailable: true,
    },
  })),
  
  setSkipped: () => set((state) => ({
    state: {
      ...state.state,
      status: 'skipped',
      timestamp: Date.now(),
      actorAvailable: false,
      results: [],
    },
  })),
  
  setComplete: (results: PreflightMethodResult[]) => set((state) => ({
    state: {
      ...state.state,
      status: 'complete',
      timestamp: Date.now(),
      actorAvailable: true,
      results,
    },
  })),
  
  reset: () => set({ state: initialState }),
}));
