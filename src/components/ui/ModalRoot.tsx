import { useEffect, useRef, useId, useState } from 'react';
import { useModalStore } from '@/store/modalStore';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';

interface PromptBodyProps {
  defaultValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

interface SelectBodyProps {
  options: Array<{ value: string; label: string; group?: string }>;
  defaultValue?: string | undefined;
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

function SelectBody({ options, defaultValue, onSubmit, onCancel }: SelectBodyProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const groupedOptions = options.reduce((groups, option) => {
    const key = option.group ?? 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(option);
    return groups;
  }, {} as Record<string, Array<{ value: string; label: string; group?: string }>>);

  const groupOrder = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', 'No position', 'Other'];

  return (
    <>
      <div className="space-y-6 mb-4 max-h-72 overflow-y-auto pr-1">
        {groupOrder
          .filter((group) => groupedOptions[group]?.length)
          .map((group) => (
            <div key={group}>
              {group !== 'Other' && (
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {group}
                </div>
              )}
              <div className="space-y-2">
                {(groupedOptions[group] ?? []).map((option) => (
                  <label key={option.value} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm hover:border-brand-500">
                    <input
                      type="radio"
                      name="select-dialog"
                      value={option.value}
                      checked={selectedValue === option.value}
                      onChange={() => setSelectedValue(option.value)}
                      className="h-4 w-4 text-brand-600"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(selectedValue)} disabled={!selectedValue}>
          Choose
        </Button>
      </div>
    </>
  );
}

export function ModalRoot() {
  const request = useModalStore((state) => state.request);
  const setRequest = useModalStore((state) => state.setRequest);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    previousActive.current = document.activeElement as HTMLElement | null;

    // focus first focusable element in the dialog or the dialog itself
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable.item(0);
    if (first) (first as HTMLElement).focus();
    else el.focus();

    return () => {
      // restore previous focus
      previousActive.current?.focus();
    };
  }, [request]);

  if (!request) return null;

  function close() {
    setRequest(null);
  }

  function handleConfirm(result: boolean) {
    if (request?.type === 'confirm') request.resolve(result);
    close();
  }

  function handlePromptSubmit(value: string) {
    if (request?.type === 'prompt' || request?.type === 'select') request.resolve(value || null);
    close();
  }

  function handlePromptCancel() {
    if (request?.type === 'prompt' || request?.type === 'select') request.resolve(null);
    close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (request?.type === 'confirm') handleConfirm(false);
      else if (request?.type === 'prompt' || request?.type === 'select') handlePromptCancel();
    }

    if (e.key === 'Tab' && dialogRef.current) {
      const el = dialogRef.current;
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={handleKeyDown}>
        <Card className="w-full max-w-sm">
          <h2 id={titleId} className="sr-only">
            Dialog
          </h2>
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
        ) : request.type === 'prompt' ? (
          <PromptBody
            key={request.message}
            defaultValue={request.defaultValue}
            onSubmit={handlePromptSubmit}
            onCancel={handlePromptCancel}
          />
        ) : (
          <SelectBody
            key={request.message}
            options={request.options}
            defaultValue={request.defaultValue}
            onSubmit={handlePromptSubmit}
            onCancel={handlePromptCancel}
          />
        )}
        </Card>
      </div>
    </div>
  );
}