import { useDrawingStore } from '../store/drawingStore';
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

  function handleToolClick(tool: DrawingTool) {
    // Clicking the already-active tool turns it off (back to select/pan mode).
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
                ? 'bg-pitch text-white border-pitch'
                : 'bg-white text-gray-700 border-gray-300 hover:border-pitch'
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
          className="rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        >
          Done drawing
        </button>
      )}
      <button onClick={clearAll} className="ml-2 text-sm text-red-600 hover:underline">
        Clear drawings
      </button>
    </div>
  );
}