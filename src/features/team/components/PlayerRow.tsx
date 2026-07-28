import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useUpdatePlayer } from '../hooks/useUpdatePlayer';
import { useDeletePlayer } from '../hooks/useDeletePlayer';
import type { Player, PlayerPosition } from '../types/team.types';

interface PlayerRowProps {
  player: Player;
  teamId: string;
}

const POSITION_OPTIONS: Array<{ value: PlayerPosition | ''; label: string }> = [
  { value: '', label: 'No position set' },
  { value: 'GK', label: 'Goalkeeper (GK)' },
  { value: 'DF', label: 'Defender (DF)' },
  { value: 'MF', label: 'Midfielder (MF)' },
  { value: 'FW', label: 'Forward (FW)' },
];

export function PlayerRow({ player, teamId }: PlayerRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(player.full_name);
  const [jerseyNumber, setJerseyNumber] = useState(player.jersey_number?.toString() ?? '');
  const [position, setPosition] = useState<PlayerPosition | ''>((player.position as PlayerPosition) ?? '');

  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer(teamId);
  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer(teamId);

  function handleSave() {
    updatePlayer(
      {
        playerId: player.id,
        updates: {
          full_name: fullName,
          jersey_number: jerseyNumber ? Number(jerseyNumber) : null,
          position: position || null,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleDelete() {
    if (confirm(`Remove ${player.full_name} from the roster?`)) {
      deletePlayer(player.id);
    }
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-3 rounded-md border border-pitch px-4 py-3">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <div className="flex gap-3">
          <Input
            label="Jersey #"
            type="number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            min={0}
            max={99}
          />
          <Select
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value as PlayerPosition | '')}
            options={POSITION_OPTIONS}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} isLoading={isUpdating}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-md border border-gray-200 px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pitch text-white text-sm font-bold">
        {player.jersey_number ?? '–'}
      </span>
      <span className="font-medium text-gray-900">{player.full_name}</span>
      {player.position && <span className="ml-2 text-sm text-gray-500">{player.position}</span>}
      <div className="ml-auto flex gap-3">
        <button onClick={() => setIsEditing(true)} className="text-sm text-pitch-dark hover:underline">
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {isDeleting ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </li>
  );
}