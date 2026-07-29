import type { Player } from '@/features/team/types/team.types';
import type { SportType, PlayerPosition } from '@/features/team/types/team.types';

export interface PitchPosition {
  x: number;
  y: number;
}

const POSITION_X_FRACTION: Record<PlayerPosition, number> = {
  GK: 0.08,
  DF: 0.3,
  MF: 0.55,
  FW: 0.85,
};

const SPORT_FORMATIONS: Record<SportType, Record<PlayerPosition, number>> = {
  football: { GK: 1, DF: 4, MF: 3, FW: 3 },
  futsal: { GK: 1, DF: 2, MF: 1, FW: 1 },
  mini_soccer: { GK: 1, DF: 2, MF: 3, FW: 1 },
};

function isPlayerPosition(value: string | null): value is PlayerPosition {
  return value === 'GK' || value === 'DF' || value === 'MF' || value === 'FW';
}

// Only players the coach has explicitly marked as starters (roster page) are
// eligible for auto-placement — everyone else stays on the bench by default,
// and can still be dragged on manually as a substitution.
function groupByPosition(players: Player[]): Record<PlayerPosition, Player[]> {
  const groups: Record<PlayerPosition, Player[]> = { GK: [], DF: [], MF: [], FW: [] };
  for (const player of players) {
    if (player.is_starter && isPlayerPosition(player.position)) {
      groups[player.position].push(player);
    }
  }
  return groups;
}

export function computeDefaultPositions(
  players: Player[],
  sportType: SportType,
  pitchWidth: number,
  pitchHeight: number,
): Record<string, PitchPosition> {
  const groups = groupByPosition(players);
  const slotCounts = SPORT_FORMATIONS[sportType];
  const positions: Record<string, PitchPosition> = {};
  const verticalMargin = pitchHeight * 0.12;
  const usableHeight = pitchHeight - verticalMargin * 2;

  (Object.keys(groups) as PlayerPosition[]).forEach((groupKey) => {
    const slotCount = slotCounts[groupKey];
    const groupPlayers = groups[groupKey].slice(0, slotCount);
    const x = pitchWidth * POSITION_X_FRACTION[groupKey];
    const step = usableHeight / (groupPlayers.length + 1);

    groupPlayers.forEach((player, index) => {
      positions[player.id] = {
        x,
        y: verticalMargin + step * (index + 1),
      };
    });
  });

  return positions;
}