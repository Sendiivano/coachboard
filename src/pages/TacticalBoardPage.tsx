import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayers } from '@/features/team/hooks/usePlayers';
import { useTeam } from '@/features/team/hooks/useTeam';
import { useBoardStore } from '@/features/board/store/boardStore';
import { useFormationStore } from '@/features/board/store/formationStore';
import { useOppositionStore } from '@/features/board/store/oppositionStore';
import { TacticalBoardCanvas } from '@/features/board/components/TacticalBoardCanvas';
import { RosterSidebar } from '@/features/board/components/RosterSidebar';
import { computeDefaultPositions } from '@/features/board/utils/formationLayout';
import type { SportType } from '@/features/team/types/team.types';
import { PITCH_WIDTH, PITCH_HEIGHT } from '@/features/board/constants';
import { Button } from '@/components/ui/Button';
import { DrawingToolbar } from '@/features/board/components/DrawingToolbar';
import { FormationSaveControls } from '@/features/board/components/FormationSaveControls';
import { FormationLoadDropdown } from '@/features/board/components/FormationLoadDropdown';
import { useUndoRedoShortcuts } from '@/features/board/hooks/useUndoRedoShortcuts';

export function TacticalBoardPage() {
  useUndoRedoShortcuts();
  const { teamId } = useParams<{ teamId: string }>();
  const AUTO_CENTER_DELAY_MS = 2000;
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const { data: players, isLoading: isPlayersLoading } = usePlayers(teamId);
  const resetView = useBoardStore((state) => state.resetView);
  const setInitialPositions = useFormationStore((state) => state.setInitialPositions);

  const isOppositionVisible = useOppositionStore((state) => state.isVisible);
  const toggleOpposition = useOppositionStore((state) => state.toggleVisible);
  const addOppositionMarker = useOppositionStore((state) => state.addMarker);

  useEffect(() => {
    if (players && players.length > 0 && team) {
      const defaults = computeDefaultPositions(players, team.sport_type as SportType, PITCH_WIDTH, PITCH_HEIGHT);
      setInitialPositions(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, team]);

  // Auto-center the view shortly after load — gives the coach a moment to see
  // the initial state before the view settles, but never overrides manual pan/zoom after that.
  // Auto-center after a pause in panning/zooming — resets the idle timer on
  // every view change, so it only fires once the coach stops interacting.
  const boardScale = useBoardStore((state) => state.scale);
  const boardPosition = useBoardStore((state) => state.position);

  useEffect(() => {
    const timer = setTimeout(() => resetView(), AUTO_CENTER_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardScale, boardPosition.x, boardPosition.y]);

  if (isTeamLoading || isPlayersLoading) return <p className="text-gray-500">Loading roster…</p>;
  if (!players || !team) return <p className="text-red-600">Could not load roster.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl font-semibold">Tactical Board</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {teamId && <FormationLoadDropdown teamId={teamId} />}
          {teamId && <FormationSaveControls teamId={teamId} />}
        </div>
        <div className="flex gap-2 flex-wrap">
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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <TacticalBoardCanvas players={players} />
        </div>
        <aside className="w-full lg:w-64 lg:shrink-0">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Roster</h2>
          <RosterSidebar players={players} />
        </aside>
      </div>
    </div>
  );
}