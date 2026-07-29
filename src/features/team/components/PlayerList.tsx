import { PlayerRow } from './PlayerRow';
import type { Player } from '../types/team.types';

interface PlayerListProps {
  players: Player[];
  teamId: string;
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  if (players.length === 0) {
    return <p className="text-gray-500 p-6">No players yet. Add your first player above.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {players.map((player) => (
        <PlayerRow key={player.id} player={player} teamId={teamId} />
      ))}
    </ul>
  );
}