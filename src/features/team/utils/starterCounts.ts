import type { Player, SportType, PlayerPosition } from '../types/team.types';

// Mirrors the same formation shape used by the tactical board — kept as a
// single source of truth would be ideal long-term, but duplicated here
// intentionally for now since roster and board are different features
// (worth consolidating into a shared config if formations become configurable).
const SPORT_FORMATIONS: Record<SportType, Record<PlayerPosition, number>> = {
  football: { GK: 1, DF: 4, MF: 3, FW: 3 },
  futsal: { GK: 1, DF: 2, MF: 1, FW: 1 },
  mini_soccer: { GK: 1, DF: 2, MF: 3, FW: 1 },
};

export interface StarterCount {
  position: PlayerPosition;
  selected: number;
  required: number;
}

export function computeStarterCounts(players: Player[], sportType: SportType): StarterCount[] {
  const required = SPORT_FORMATIONS[sportType];
  const positions: PlayerPosition[] = ['GK', 'DF', 'MF', 'FW'];

  return positions.map((position) => ({
    position,
    selected: players.filter((p) => p.is_starter && p.position === position).length,
    required: required[position],
  }));
}