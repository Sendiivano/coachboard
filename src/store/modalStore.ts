import { create } from 'zustand';

interface ConfirmRequest {
  type: 'confirm';
  message: string;
  resolve: (value: boolean) => void;
}

interface PromptRequest {
  type: 'prompt';
  message: string;
  defaultValue: string;
  resolve: (value: string | null) => void;
}

type ModalRequest = ConfirmRequest | PromptRequest;

interface ModalState {
  request: ModalRequest | null;
  setRequest: (request: ModalRequest | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  request: null,
  setRequest: (request) => set({ request }),
}));

// Promise-based replacements for window.confirm/prompt — resolves when the
// user clicks a button on the rendered ModalRoot component.
export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    useModalStore.getState().setRequest({ type: 'confirm', message, resolve });
  });
}

export function promptDialog(message: string, defaultValue = ''): Promise<string | null> {
  return new Promise((resolve) => {
    useModalStore.getState().setRequest({ type: 'prompt', message, defaultValue, resolve });
  });
}