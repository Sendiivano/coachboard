import { PlayerRow } from './PlayerRow';
import type { Player } from '../types/team.types';

interface PlayerListProps {
  players: Player[];
  teamId: string;
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  if (players.length === 0) {
    return <p className="text-gray-500">No players yet. Add your first player above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {players.map((player) => (
        <PlayerRow key={player.id} player={player} teamId={teamId} />
      ))}
    </ul>
  );
}