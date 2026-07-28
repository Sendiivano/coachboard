import { Link } from 'react-router-dom';
import type { Team } from '../types/team.types';

interface TeamListProps {
  teams: Team[];
}

const SPORT_LABELS: Record<string, string> = {
  football: 'Football',
  futsal: 'Futsal',
  mini_soccer: 'Mini Soccer',
};

export function TeamList({ teams }: TeamListProps) {
  if (teams.length === 0) {
    return <p className="text-gray-500">No teams yet. Create your first team above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {teams.map((team) => (
        <li key={team.id}>
          <Link
            to={`/teams/${team.id}`}
            className="block rounded-md border border-gray-200 px-4 py-3 hover:border-pitch hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{team.name}</span>
            <span className="ml-2 text-sm text-gray-500">
              {SPORT_LABELS[team.sport_type] ?? team.sport_type}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}