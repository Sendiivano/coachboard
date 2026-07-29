import { useDrawingStore } from '../store/drawingStore';
import { useHistoryStore } from '../store/historyStore';
import type { DrawingTool } from '../types/drawing.types';

const TOOLS: Array<{ value: DrawingTool; label: string }> = [
  { value: 'arrow', label: 'Arrow' },
  { value: 'cone', label: 'Cone' },
  { value: 'football', label: 'Football' },
  { value: 'text', label: 'Text' },
];

export function DrawingToolbar() {
  const selectedTool = useDrawingStore((state) => state.selectedTool);
  const setSelectedTool = useDrawingStore((state) => state.setSelectedTool);
  const clearAll = useDrawingStore((state) => state.clearAll);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);

  function handleClearAll() {
    recordSnapshot();
    clearAll();
  }

  function handleToolClick(tool: DrawingTool) {
    setSelectedTool(selectedTool === tool ? 'select' : tool);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TOOLS.map((tool) => {
        const isActive = selectedTool === tool.value;
        return (
          <button
            key={tool.value}
            onClick={() => handleToolClick(tool.value)}
            aria-pressed={isActive}
            className={`rounded-md px-3 py-1.5 text-sm font-medium border transition-colors ${
              isActive
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
            }`}
          >
            {tool.label}
            {isActive && <span className="ml-1.5 text-xs opacity-80">●</span>}
          </button>
        );
      })}
      {selectedTool !== 'select' && (
        <button
          onClick={() => setSelectedTool('select')}
          className="rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
        >
          Done drawing
        </button>
      )}
      <button onClick={handleClearAll} className="text-sm text-red-600 hover:text-red-700">
        Clear drawings
      </button>
      <div className="flex gap-2 ml-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↪ Redo
        </button>
      </div>
    </div>
  );
}