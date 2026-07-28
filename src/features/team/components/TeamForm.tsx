import { type FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateTeam } from '../hooks/useCreateTeam';
import type { SportType } from '../types/team.types';

interface TeamFormProps {
  ownerId: string;
  onSuccess: () => void;
}

const SPORT_OPTIONS: Array<{ value: SportType; label: string }> = [
  { value: 'football', label: 'Football' },
  { value: 'futsal', label: 'Futsal' },
  { value: 'mini_soccer', label: 'Mini Soccer' },
];

export function TeamForm({ ownerId, onSuccess }: TeamFormProps) {
  const [name, setName] = useState('');
  const [sportType, setSportType] = useState<SportType>('football');
  const { mutate, isPending, error } = useCreateTeam();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate(
      { owner_id: ownerId, name, sport_type: sportType },
      { onSuccess },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm" noValidate>
      <Input label="Team name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select
        label="Sport type"
        value={sportType}
        onChange={(e) => setSportType(e.target.value as SportType)}
        options={SPORT_OPTIONS}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <Button type="submit" isLoading={isPending}>
        Create team
      </Button>
    </form>
  );
}