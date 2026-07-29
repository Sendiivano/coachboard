import { computeStarterCounts } from '../utils/starterCounts';
import type { Player, SportType } from '../types/team.types';

interface StarterSummaryProps {
  players: Player[];
  sportType: SportType;
}

export function StarterSummary({ players, sportType }: StarterSummaryProps) {
  const counts = computeStarterCounts(players, sportType);

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {counts.map(({ position, selected, required }) => {
        const isOver = selected > required;
        const isUnder = selected < required;
        return (
          <span
            key={position}
            className={`rounded-full px-3 py-1 font-medium ${
              isOver
                ? 'bg-amber-100 text-amber-800'
                : isUnder
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {position}: {selected}/{required}
            {isOver && ' (extra will bench)'}
          </span>
        );
      })}
    </div>
  );
}