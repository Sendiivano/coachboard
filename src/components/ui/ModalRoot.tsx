import { useState } from 'react';
import { useModalStore } from '@/store/modalStore';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';

interface PromptBodyProps {
  defaultValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

// Separated so it can be remounted via `key` whenever a new prompt request
// comes in — that resets local state naturally, no effect-based syncing needed.
function PromptBody({ defaultValue, onSubmit, onCancel }: PromptBodyProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  return (
    <>
      <Input label="Name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoFocus className="mb-4" />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(inputValue)}>Save</Button>
      </div>
    </>
  );
}

export function ModalRoot() {
  const request = useModalStore((state) => state.request);
  const setRequest = useModalStore((state) => state.setRequest);

  if (!request) return null;

  function close() {
    setRequest(null);
  }

  function handleConfirm(result: boolean) {
    if (request?.type === 'confirm') request.resolve(result);
    close();
  }

  function handlePromptSubmit(value: string) {
    if (request?.type === 'prompt') request.resolve(value || null);
    close();
  }

  function handlePromptCancel() {
    if (request?.type === 'prompt') request.resolve(null);
    close();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-sm">
        <p className="text-gray-900 mb-4">{request.message}</p>

        {request.type === 'confirm' ? (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleConfirm(true)}>
              Confirm
            </Button>
          </div>
        ) : (
          <PromptBody
            key={request.message}
            defaultValue={request.defaultValue}
            onSubmit={handlePromptSubmit}
            onCancel={handlePromptCancel}
          />
        )}
      </Card>
    </div>
  );
}