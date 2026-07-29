import type { Player } from '@/features/team/types/team.types';
import { useFormationStore } from '../store/formationStore';

interface RosterSidebarProps {
  players: Player[];
}

// Lists players not currently placed on the pitch. Supports both drag-and-drop
// and a click fallback ("Add") for accessibility — drag alone isn't keyboard-usable.
export function RosterSidebar({ players }: RosterSidebarProps) {
  const positions = useFormationStore((state) => state.positions);
  const setPosition = useFormationStore((state) => state.setPosition);

  const unplacedPlayers = players.filter((player) => !positions[player.id]);

  function handleDragStart(event: React.DragEvent, playerId: string) {
    event.dataTransfer.setData('text/plain', playerId);
  }

  function handleAddToPitch(playerId: string) {
    // Default drop point near the center; coach can drag to refine.
    setPosition(playerId, { x: 450, y: 300 });
  }

  if (unplacedPlayers.length === 0) {
    return <p className="text-sm text-gray-500">All players are on the pitch.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {unplacedPlayers.map((player) => (
        <li
          key={player.id}
          draggable
          onDragStart={(e) => handleDragStart(e, player.id)}
          className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 cursor-grab active:cursor-grabbing"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pitch text-white text-xs font-bold">
            {player.jersey_number ?? '–'}
          </span>
          <span className="text-sm text-gray-900">{player.full_name}</span>
          <button
            onClick={() => handleAddToPitch(player.id)}
            className="ml-auto text-xs font-medium text-pitch-dark hover:underline"
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}