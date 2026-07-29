import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import type Konva from 'konva';
import { usePlayers } from '@/features/team/hooks/usePlayers';
import { useTeam } from '@/features/team/hooks/useTeam';
import { useBoardStore } from '@/features/board/store/boardStore';
import { useFormationStore } from '@/features/board/store/formationStore';
import { useOppositionStore } from '@/features/board/store/oppositionStore';
import { TacticalBoardCanvas } from '@/features/board/components/TacticalBoardCanvas';
import { RosterSidebar } from '@/features/board/components/RosterSidebar';
import { DrawingToolbar } from '@/features/board/components/DrawingToolbar';
import { FormationSaveControls } from '@/features/board/components/FormationSaveControls';
import { FormationLoadDropdown } from '@/features/board/components/FormationLoadDropdown';
import { ExportControls } from '@/features/board/components/ExportControls';
import { computeDefaultPositions } from '@/features/board/utils/formationLayout';
import { PITCH_WIDTH, PITCH_HEIGHT } from '@/features/board/constants';
import { useUndoRedoShortcuts } from '@/features/board/hooks/useUndoRedoShortcuts';
import type { SportType } from '@/features/team/types/team.types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const AUTO_CENTER_DELAY_MS = 2000;

export function TacticalBoardPage() {
  useUndoRedoShortcuts();
  const { teamId } = useParams<{ teamId: string }>();
  const stageRef = useRef<Konva.Stage | null>(null);

  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const { data: players, isLoading: isPlayersLoading } = usePlayers(teamId);

  const resetView = useBoardStore((state) => state.resetView);
  const boardScale = useBoardStore((state) => state.scale);
  const boardPosition = useBoardStore((state) => state.position);
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

  useEffect(() => {
    const timer = setTimeout(() => resetView(), AUTO_CENTER_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardScale, boardPosition.x, boardPosition.y]);

  if (isTeamLoading || isPlayersLoading) {
    return (
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4 px-0 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!players || !team) return <p className="text-red-600">Could not load roster.</p>;
  const starterCount = players.filter((player) => player.is_starter).length;
  if (starterCount < 11) {
    return (
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4 px-0 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-semibold text-red-900">Tactical board unavailable</h1>
          <p className="mt-3 text-sm text-red-700">
            You need {11 - starterCount} more starter{starterCount === 10 ? '' : 's'} before opening the tactical board.
          </p>
          <Link to={`/team/${teamId}`} className="mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Back to roster
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col gap-4 px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tactical Board</h1>
          <p className="text-sm text-gray-500">{team.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FormationLoadDropdown teamId={team.id} />
          <FormationSaveControls teamId={team.id} />
        </div>
      </div>

      <Card padded={false} className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DrawingToolbar />
          <div className="flex gap-2 flex-wrap">
            <ExportControls stageRef={stageRef} teamName={team.name} />
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
      </Card>

      <p className="text-sm text-gray-400">
        Scroll to zoom, drag to pan, drag players onto the pitch. Dragging a player off the pitch sends them
        back to the bench.
      </p>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 min-w-0">
          <TacticalBoardCanvas players={players} onStageReady={(stage) => (stageRef.current = stage)} />
        </div>
        <aside className="w-full lg:w-80 lg:shrink-0">
          <Card padded={false} className="h-full">
            <h2 className="text-sm font-semibold text-gray-700 px-4 py-3 border-b border-gray-100">Roster</h2>
            <div className="p-4">
              <RosterSidebar players={players} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}