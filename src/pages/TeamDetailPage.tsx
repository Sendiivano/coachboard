import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeam } from '@/features/team/hooks/useTeam';
import { usePlayers } from '@/features/team/hooks/usePlayers';
import { PlayerForm } from '@/features/team/components/PlayerForm';
import { PlayerList } from '@/features/team/components/PlayerList';
import { StarterSummary } from '@/features/team/components/StarterSummary';
import type { SportType } from '@/features/team/types/team.types';

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: players, isLoading: playersLoading, error } = usePlayers(teamId);
  const [showForm, setShowForm] = useState(false);

  if (teamLoading) return <p className="text-gray-500">Loading team…</p>;
  if (!team) return <p className="text-red-600">Team not found.</p>;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link to="/teams" className="text-sm text-pitch-dark hover:underline">
          ← Back to teams
        </Link>
        <h1 className="text-xl font-semibold mt-2">{team.name}</h1>
        <Link to={`/board/${team.id}`} className="text-sm text-pitch-dark hover:underline">
          Open Tactical Board →
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Roster</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="text-sm font-medium text-pitch-dark hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add player'}
        </button>
      </div>
      <span className="text-xs text-gray-400 -mt-4">Check "Starter" to auto-place on the tactical board</span>
      {players && <StarterSummary players={players} sportType={team.sport_type as SportType} />}

      {showForm && teamId && (
        <PlayerForm teamId={teamId} onSuccess={() => setShowForm(false)} />
      )}

      {playersLoading && <p className="text-gray-500">Loading players…</p>}
      {error && <p className="text-red-600">Failed to load players: {error.message}</p>}
      {players && teamId && <PlayerList players={players} teamId={teamId} />}
    </div>
  );
}