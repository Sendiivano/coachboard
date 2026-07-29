import { useState } from 'react';
import { useTeams } from '@/features/team/hooks/useTeams';
import { TeamForm } from '@/features/team/components/TeamForm';
import { TeamList } from '@/features/team/components/TeamList';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export function TeamsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: teams, isLoading, error } = useTeams();
  const [showForm, setShowForm] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      {isLoading && (
        <Card>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-3/5" />
          </div>
        </Card>
      )}
      {error && <p className="text-red-600">Failed to load teams: {error.message}</p>}
      {teams && teams.length === 0 && (
        <Card>
          <EmptyState
            title="No teams yet"
            description="Create your first team to start building rosters and formations."
            action={<Button onClick={() => setShowForm(true)}>+ New team</Button>}
          />
        </Card>
      )}
      {teams && teams.length > 0 && (
        <Card padded={false}>
          <TeamList teams={teams} />
        </Card>
      )}    
    </div>
  );
}