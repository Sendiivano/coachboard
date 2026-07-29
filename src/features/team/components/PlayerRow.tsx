import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useUpdatePlayer } from '../hooks/useUpdatePlayer';
import { useDeletePlayer } from '../hooks/useDeletePlayer';
import { useToggleStarter } from '../hooks/useToggleStarter';
import { confirmDialog } from '@/store/modalStore';
import { toast } from '@/store/toastStore';
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
  const { mutate: toggleStarter } = useToggleStarter(teamId);

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

  async function handleDelete() {
    const confirmed = await confirmDialog(`Remove ${player.full_name} from the roster?`);
    if (confirmed) {
      deletePlayer(player.id, {
        onSuccess: () => toast.success(`${player.full_name} removed from roster`),
        onError: () => toast.error('Failed to remove player'),
      });
    }
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-3 px-6 py-4 bg-brand-50/40">
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
    <li className="flex items-center gap-3 px-6 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-semibold shrink-0">
        {player.jersey_number ?? '–'}
      </span>
      <span className="font-medium text-gray-900 truncate">{player.full_name}</span>
      {player.position && <span className="text-sm text-gray-400">{player.position}</span>}
      <label className="ml-3 flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={player.is_starter}
          onChange={(e) => toggleStarter({ playerId: player.id, isStarter: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        Starter
      </label>
      <div className="ml-auto flex gap-3 shrink-0">
        <button onClick={() => setIsEditing(true)} className="text-sm text-brand-600 hover:text-brand-700">
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </li>
  );
}