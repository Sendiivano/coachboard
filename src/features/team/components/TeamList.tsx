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
    return <p className="text-gray-500 p-6">No teams yet. Create your first team above.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {teams.map((team) => (
        <li key={team.id}>
          <Link
            to={`/teams/${team.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-brand-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{team.name}</span>
            <span className="text-sm text-gray-500">
              {SPORT_LABELS[team.sport_type] ?? team.sport_type}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}