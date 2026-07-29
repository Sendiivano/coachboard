import { useState } from 'react';
import { useTeams } from '@/features/team/hooks/useTeams';
import { TeamForm } from '@/features/team/components/TeamForm';
import { TeamList } from '@/features/team/components/TeamList';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function TeamsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: teams, isLoading, error } = useTeams();
  const [showForm, setShowForm] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Teams</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage the teams you coach.</p>
        </div>
        <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Cancel' : '+ New team'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <TeamForm ownerId={user.id} onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      {isLoading && <p className="text-gray-500">Loading teams…</p>}
      {error && <p className="text-red-600">Failed to load teams: {error.message}</p>}
      {teams && (
        <Card padded={false}>
          <TeamList teams={teams} />
        </Card>
      )}
    </div>
  );
}