import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';

// Ctrl+Z / Cmd+Z to undo, Ctrl+Shift+Z / Cmd+Shift+Z to redo.
// Mounted once at the board page level.
export function useUndoRedoShortcuts() {
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifierPressed = event.ctrlKey || event.metaKey;
      if (!isModifierPressed || event.key.toLowerCase() !== 'z') return;

      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
}