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

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: players, isLoading: playersLoading, error } = usePlayers(teamId);
  const [showForm, setShowForm] = useState(false);

  if (teamLoading) return <p className="text-gray-500">Loading team…</p>;
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

      {playersLoading && <p className="text-gray-500">Loading players…</p>}
      {error && <p className="text-red-600">Failed to load players: {error.message}</p>}
      {players && teamId && (
        <Card padded={false}>
          <PlayerList players={players} teamId={teamId} />
        </Card>
      )}
    </div>
  );
}