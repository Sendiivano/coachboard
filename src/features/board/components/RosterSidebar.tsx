import type { Player } from '@/features/team/types/team.types';
import { useFormationStore } from '../store/formationStore';
import { PLAYER_TOKEN_COLOR } from '../constants';
import { useHistoryStore } from '../store/historyStore';

interface RosterSidebarProps {
  players: Player[];
}

// Lists players not currently placed on the pitch. Supports both drag-and-drop
// and a click fallback ("Add") for accessibility — drag alone isn't keyboard-usable.
export function RosterSidebar({ players }: RosterSidebarProps) {
  const positions = useFormationStore((state) => state.positions);
  const setPosition = useFormationStore((state) => state.setPosition);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);

  const unplacedPlayers = players.filter((player) => !positions[player.id]);

  function handleDragStart(event: React.DragEvent, playerId: string) {
    event.dataTransfer.setData('text/plain', playerId);
  }

  function handleAddToPitch(playerId: string) {
    recordSnapshot();
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
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white"
            style={{ backgroundColor: PLAYER_TOKEN_COLOR }}
          >
            {player.jersey_number ?? '–'}
          </span>
          <span className="text-sm text-gray-900">{player.full_name}</span>
          <button
            onClick={() => handleAddToPitch(player.id)}
            className="ml-auto p-1 rounded hover:bg-gray-100"
            aria-label="Add to pitch"
          >
            <svg className="h-4 w-4 text-pitch-dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}