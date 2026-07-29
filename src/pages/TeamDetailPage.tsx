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

  if (teamLoading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!team) return <p className="text-red-600">Team not found.</p>;
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <Link to="/teams" className="text-sm text-brand-600 hover:text-brand-700">
          ← Back to teams
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
          <Link to={`/board/${team.id}`}>
            <Button>Open Tactical Board →</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Roster</h2>
        <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Cancel' : '+ Add player'}
        </Button>
      </div>
      <p className="text-xs text-gray-400 -mt-4">Check "Starter" to auto-place on the tactical board</p>

      {players && <StarterSummary players={players} sportType={team.sport_type as SportType} />}

      {showForm && teamId && (
        <Card>
          <PlayerForm teamId={teamId} onSuccess={() => setShowForm(false)} />
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