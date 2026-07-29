import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useUpdatePlayer } from '../hooks/useUpdatePlayer';
import { useToggleStarter } from '../hooks/useToggleStarter';
import { selectDialog } from '@/store/modalStore';
import { toast } from '@/store/toastStore';
import type { Player, PlayerPosition } from '../types/team.types';

interface PlayerRowProps {
  player: Player;
  teamId: string;
  players: Player[];
}

const POSITION_OPTIONS: Array<{ value: PlayerPosition | ''; label: string }> = [
  { value: '', label: 'No position set' },
  { value: 'GK', label: 'Goalkeeper (GK)' },
  { value: 'DF', label: 'Defender (DF)' },
  { value: 'MF', label: 'Midfielder (MF)' },
  { value: 'FW', label: 'Forward (FW)' },
];

export function PlayerRow({ player, teamId, players }: PlayerRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHoveringAction, setIsHoveringAction] = useState(false);
  const [fullName, setFullName] = useState(player.full_name);
  const [jerseyNumber, setJerseyNumber] = useState(player.jersey_number?.toString() ?? '');
  const [position, setPosition] = useState<PlayerPosition | ''>((player.position as PlayerPosition) ?? '');

  const starters = players.filter((p) => p.is_starter);
  const otherStarters = starters.filter((p) => p.id !== player.id);
  const isStarterCapacityFull = otherStarters.length >= 11;

  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer(teamId);
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

  async function promptStarterReplacement() {
    const POSITION_LABELS: Record<string, string> = {
      GK: 'Goalkeepers',
      DF: 'Defenders',
      MF: 'Midfielders',
      FW: 'Forwards',
    };

    type StarterOption = {
      value: string;
      label: string;
      group: string;
    };

    const starterOptions: StarterOption[] = otherStarters
      .map((starter) => {
        const rawGroup = starter.position ? POSITION_LABELS[starter.position as keyof typeof POSITION_LABELS] : undefined;
        const group = rawGroup ?? 'No position';
        return {
          value: starter.id,
          label: `${starter.full_name} (${starter.position ?? 'No position'})`,
          group,
        };
      })
      .sort((a, b) => {
        const groupA = a.group;
        const groupB = b.group;
        return groupA === groupB ? a.label.localeCompare(b.label) : groupA.localeCompare(groupB);
      });

    const selectedId = await selectDialog(
      `Sub ${player.full_name} in. Choose a starter to sub out:`,
      starterOptions,
      starterOptions[0]?.value,
    );

    if (!selectedId) {
      return;
    }

    const replacement = otherStarters.find((starter) => starter.id === selectedId);
    if (!replacement) {
      toast.error('Could not find the chosen starter.');
      return;
    }

    toggleStarter({ playerId: player.id, isStarter: true });
    toggleStarter({ playerId: replacement.id, isStarter: false });
    toast.success(`${player.full_name} will sub in for ${replacement.full_name}.`);
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
    <li className="grid grid-cols-[40px_minmax(0,1fr)_96px_96px_64px] items-center gap-4 px-6 py-3">
      <span className="text-left text-sm font-medium text-gray-700">
        {player.jersey_number ?? '–'}
      </span>
      <span className="min-w-0 text-sm font-medium text-gray-900 truncate">{player.full_name}</span>
      <span className="text-center text-sm text-gray-500">{player.position ?? '–'}</span>
      <span className="flex justify-center">
        <button
          type="button"
          onMouseEnter={() => setIsHoveringAction(true)}
          onMouseLeave={() => setIsHoveringAction(false)}
          onClick={() => {
            if (!player.is_starter && isStarterCapacityFull) {
              promptStarterReplacement();
              return;
            }
            toggleStarter({ playerId: player.id, isStarter: !player.is_starter });
          }}
          aria-pressed={player.is_starter}
          className={`status-pill ${player.is_starter ? 'starter' : 'subs'} ${player.is_starter && isHoveringAction ? 'starter-hover' : ''} shrink-0`}
        >
          <span className="status-icon" aria-hidden="true">
            {player.is_starter ? (
              isHoveringAction ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.828-6.828a1 1 0 011.414 0L10 11.344l1.414-1.414a1 1 0 111.414 1.414L11.414 12.758l1.414 1.414a1 1 0 01-1.414 1.414L10 14.172l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414-1.414-1.414a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M16.704 5.296a1 1 0 010 1.414l-7.243 7.243a1 1 0 01-1.414 0L3.296 9.008a1 1 0 111.414-1.414l4.04 4.04 6.835-6.835a1 1 0 011.119-.103z" clipRule="evenodd" />
                </svg>
              )
            ) : isHoveringAction ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 16a1 1 0 011-1h12a1 1 0 011 1v1H3v-1z" />
              </svg>
            )}
          </span>
          <span>{player.is_starter ? (isHoveringAction ? 'Sub out' : 'Starter') : (isHoveringAction ? 'Sub In' : 'Subs')}</span>
        </button>
      </span>
      <span className="flex justify-center">
        <Button
          variant="secondary"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:border-brand-300 hover:bg-slate-50"
          title="Edit Players"
          aria-label="Edit Players"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L6 11.172V14h2.828l8.586-8.586a2 2 0 000-2.828z" />
            <path d="M5 14.5V17h2.5l7.334-7.334-2.828-2.828L5 14.5z" />
          </svg>
          <span className="sr-only">Edit Players</span>
        </Button>
      </span>
    </li>
  );
}