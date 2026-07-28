import { useState } from 'react';
import { useTeams } from '@/features/team/hooks/useTeams';
import { TeamForm } from '@/features/team/components/TeamForm';
import { TeamList } from '@/features/team/components/TeamList';
import { useAuthStore } from '@/store/authStore';

export function TeamsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: teams, isLoading, error } = useTeams();
  const [showForm, setShowForm] = useState(false);

  if (!user) return null; // ProtectedRoute guarantees a user, this satisfies TS

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Teams</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="text-sm font-medium text-pitch-dark hover:underline"
        >
          {showForm ? 'Cancel' : '+ New team'}
        </button>
      </div>

      {showForm && (
        <TeamForm ownerId={user.id} onSuccess={() => setShowForm(false)} />
      )}

      {isLoading && <p className="text-gray-500">Loading teams…</p>}
      {error && <p className="text-red-600">Failed to load teams: {error.message}</p>}
      {teams && <TeamList teams={teams} />}
    </div>
  );
}