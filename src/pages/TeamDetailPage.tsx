import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeam } from '@/features/team/hooks/useTeam';
import { usePlayers } from '@/features/team/hooks/usePlayers';
import { PlayerForm } from '@/features/team/components/PlayerForm';
import { PlayerList } from '@/features/team/components/PlayerList';
import { StarterSummary } from '@/features/team/components/StarterSummary';
import type { SportType } from '@/features/team/types/team.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: players, isLoading: playersLoading, error } = usePlayers(teamId);
  const [showForm, setShowForm] = useState(false);
  const starterCount = players?.filter((player) => player.is_starter).length ?? 0;
  const canOpenBoard = starterCount >= 11;

  if (teamLoading) {
    return (
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-4 px-0 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!team) return <p className="text-red-600">Team not found.</p>;
  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 px-0 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Link to="/teams" className="text-sm text-brand-600 hover:text-brand-700">
          ← Back to teams
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Roster</h2>
          <p className="text-xs text-gray-400 mt-1">Check "Starter" to auto-place on the tactical board</p>
          {!canOpenBoard && (
            <p className="text-xs text-red-600 mt-1">
              Add {11 - starterCount} more starter{starterCount === 10 ? '' : 's'} before opening the tactical board.
            </p>
          )}
        </div>
        {canOpenBoard ? (
          <Link to={`/board/${team.id}`}>
            <Button>Open Tactical Board →</Button>
          </Link>
        ) : (
          <Button variant="secondary" disabled>
            Open Tactical Board →
          </Button>
        )}
      </div>

      {players && <StarterSummary players={players} sportType={team.sport_type as SportType} />}

      {showForm && teamId && (
        <Card>
          <PlayerForm teamId={teamId} players={players} onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      {playersLoading && (
        <Card>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </Card>
      )}
      {error && <p className="text-red-600">Failed to load players: {error.message}</p>}
      {players && players.length === 0 && (
        <Card>
          <EmptyState
            title="No players yet"
            description="Add your first player to start building this team's roster."
            action={<Button onClick={() => setShowForm(true)}>+ Add player</Button>}
          />
        </Card>
      )}
      {players && players.length > 0 && teamId && (
        <Card padded={false}>
          <PlayerList players={players} teamId={teamId} />
        </Card>
      )}
    </div>
  );
}