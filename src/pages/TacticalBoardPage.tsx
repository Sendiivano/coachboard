import { useBoardStore } from '@/features/board/store/boardStore';
import { TacticalBoardCanvas } from '@/features/board/components/TacticalBoardCanvas';
import { Button } from '@/components/ui/Button';

export function TacticalBoardPage() {
  const resetView = useBoardStore((state) => state.resetView);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tactical Board</h1>
        <Button variant="secondary" onClick={resetView}>
          Reset view
        </Button>
      </div>
      <p className="text-sm text-gray-500">Scroll to zoom, drag to pan.</p>
      <TacticalBoardCanvas />
    </div>
  );
}