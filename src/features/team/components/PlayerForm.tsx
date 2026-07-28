import { type FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreatePlayer } from '../hooks/useCreatePlayer';
import type { PlayerPosition } from '../types/team.types';

interface PlayerFormProps {
  teamId: string;
  onSuccess: () => void;
}

const POSITION_OPTIONS: Array<{ value: PlayerPosition | ''; label: string }> = [
  { value: '', label: 'No position set' },
  { value: 'GK', label: 'Goalkeeper (GK)' },
  { value: 'DF', label: 'Defender (DF)' },
  { value: 'MF', label: 'Midfielder (MF)' },
  { value: 'FW', label: 'Forward (FW)' },
];

export function PlayerForm({ teamId, onSuccess }: PlayerFormProps) {
  const [fullName, setFullName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState<PlayerPosition | ''>('');
  const { mutate, isPending, error } = useCreatePlayer(teamId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate(
      {
        team_id: teamId,
        full_name: fullName,
        jersey_number: jerseyNumber ? Number(jerseyNumber) : null,
        position: position || null,
      },
      {
        onSuccess: () => {
          setFullName('');
          setJerseyNumber('');
          setPosition('');
          onSuccess();
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm" noValidate>
      <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <Input
        label="Jersey number (optional)"
        type="number"
        value={jerseyNumber}
        onChange={(e) => setJerseyNumber(e.target.value)}
        min={0}
        max={99}
      />
      <Select
        label="Position (optional)"
        value={position}
        onChange={(e) => setPosition(e.target.value as PlayerPosition | '')}
        options={POSITION_OPTIONS}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <Button type="submit" isLoading={isPending}>
        Add player
      </Button>
    </form>
  );
}