import { type FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreatePlayer } from '../hooks/useCreatePlayer';
import type { Player, PlayerPosition } from '../types/team.types';

interface PlayerFormProps {
  teamId: string;
  players?: Player[] | undefined;
  onSuccess: () => void;
}

const POSITION_OPTIONS: Array<{ value: PlayerPosition | ''; label: string }> = [
  { value: '', label: 'No position set' },
  { value: 'GK', label: 'Goalkeeper (GK)' },
  { value: 'DF', label: 'Defender (DF)' },
  { value: 'MF', label: 'Midfielder (MF)' },
  { value: 'FW', label: 'Forward (FW)' },
];

export function PlayerForm({ teamId, players, onSuccess }: PlayerFormProps) {
  const [fullName, setFullName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState<PlayerPosition | ''>('');
  const [fullNameError, setFullNameError] = useState('');
  const [jerseyNumberError, setJerseyNumberError] = useState('');
  const [positionError, setPositionError] = useState('');
  const startersCount = players?.filter((player) => player.is_starter).length ?? 0;
  const isStarterCapacityFull = startersCount >= 11;
  const { mutate, isPending, error } = useCreatePlayer(teamId);

  function validateForm() {
    const trimmedName = fullName.trim();
    let hasError = false;

    if (!trimmedName) {
      setFullNameError('Player name is required.');
      hasError = true;
    } else if (
      players?.some(
        (player) => player.full_name.trim().toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setFullNameError('A player with this name already exists.');
      hasError = true;
    } else {
      setFullNameError('');
    }

    if (jerseyNumber) {
      const jersey = Number(jerseyNumber);
      if (Number.isNaN(jersey)) {
        setJerseyNumberError('Enter a valid jersey number.');
        hasError = true;
      } else if (jersey < 0 || jersey > 99) {
        setJerseyNumberError('Jersey number must be between 0 and 99.');
        hasError = true;
      } else if (
        players?.some((player) => player.jersey_number === jersey && jersey !== null)
      ) {
        setJerseyNumberError('That jersey number is already taken.');
        hasError = true;
      } else {
        setJerseyNumberError('');
      }
    } else {
      setJerseyNumberError('');
    }

    if (!position) {
      setPositionError('Please select a player position.');
      hasError = true;
    } else if (isStarterCapacityFull) {
      setPositionError('Starters are full. Remove a starter before adding another player.');
      hasError = true;
    } else {
      setPositionError('');
    }

    return { hasError, trimmedName };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { hasError, trimmedName } = validateForm();
    if (hasError) return;

    mutate(
      {
        team_id: teamId,
        full_name: trimmedName,
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
      <Input
        label="Full name"
        value={fullName}
        onChange={(e) => {
          setFullName(e.target.value);
          if (fullNameError) setFullNameError('');
        }}
        required
        error={fullNameError}
      />
      <Input
        label="Jersey number (optional)"
        type="number"
        value={jerseyNumber}
        onChange={(e) => {
          setJerseyNumber(e.target.value);
          if (jerseyNumberError) setJerseyNumberError('');
        }}
        min={0}
        max={99}
        error={jerseyNumberError}
      />
      <Select
        label="Position"
        value={position}
        onChange={(e) => {
          setPosition(e.target.value as PlayerPosition | '');
          if (positionError) setPositionError('');
        }}
        options={POSITION_OPTIONS}
        error={positionError}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <Button type="submit" isLoading={isPending} disabled={isStarterCapacityFull}>
        Add player
      </Button>
    </form>
  );
}