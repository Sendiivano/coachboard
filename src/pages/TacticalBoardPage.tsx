import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayers } from '@/features/team/hooks/usePlayers';
import { useBoardStore } from '@/features/board/store/boardStore';
import { useFormationStore } from '@/features/board/store/formationStore';
import { useOppositionStore } from '@/features/board/store/oppositionStore';
import { TacticalBoardCanvas } from '@/features/board/components/TacticalBoardCanvas';
import { RosterSidebar } from '@/features/board/components/RosterSidebar';
import { computeDefaultPositions } from '@/features/board/utils/formationLayout';
import { PITCH_WIDTH, PITCH_HEIGHT } from '@/features/board/constants';
import { Button } from '@/components/ui/Button';
import { DrawingToolbar } from '@/features/board/components/DrawingToolbar';
import { FormationSaveControls } from '@/features/board/components/FormationSaveControls';
import { FormationLoadDropdown } from '@/features/board/components/FormationLoadDropdown';
import { useUndoRedoShortcuts } from '@/features/board/hooks/useUndoRedoShortcuts';

export function TacticalBoardPage() {
    useUndoRedoShortcuts(); // Mounts global undo/redo keyboard shortcuts
  const { teamId } = useParams<{ teamId: string }>();
  const { data: players, isLoading } = usePlayers(teamId);
  const resetView = useBoardStore((state) => state.resetView);
  const setInitialPositions = useFormationStore((state) => state.setInitialPositions);

  const isOppositionVisible = useOppositionStore((state) => state.isVisible);
  const toggleOpposition = useOppositionStore((state) => state.toggleVisible);
  const addOppositionMarker = useOppositionStore((state) => state.addMarker);

  useEffect(() => {
    if (players && players.length > 0) {
      const defaults = computeDefaultPositions(players, PITCH_WIDTH, PITCH_HEIGHT);
      setInitialPositions(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  if (isLoading) return <p className="text-gray-500">Loading roster…</p>;
  if (!players) return <p className="text-red-600">Could not load roster.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Tactical Board</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {teamId && <FormationLoadDropdown teamId={teamId} />}
          {teamId && <FormationSaveControls teamId={teamId} />}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={toggleOpposition}>
            {isOppositionVisible ? 'Hide opposition' : 'Show opposition'}
          </Button>
          {isOppositionVisible && (
            <Button variant="secondary" onClick={addOppositionMarker}>
              + Add opposition marker
            </Button>
          )}
          <Button variant="secondary" onClick={resetView}>
            Reset view
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Scroll to zoom, drag to pan, drag players onto the pitch. Dragging a player off the pitch sends them
        back to the bench.
      </p>
      <DrawingToolbar />
      <div className="flex gap-6">
        <div className="flex-1">
          <TacticalBoardCanvas players={players} />
        </div>
        <aside className="w-64 shrink-0">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Roster</h2>
          <RosterSidebar players={players} />
        </aside>
      </div>
    </div>
  );
}