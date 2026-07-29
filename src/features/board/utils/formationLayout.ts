import type { Player } from '@/features/team/types/team.types';

export interface PitchPosition {
  x: number;
  y: number;
}

// Depth (x-axis) fraction per position group — goal to attack, left to right.
const POSITION_X_FRACTION: Record<string, number> = {
  GK: 0.08,
  DF: 0.3,
  MF: 0.55,
  FW: 0.85,
};

const DEFAULT_GROUP = 'MF';

function groupByPosition(players: Player[]): Record<string, Player[]> {
  const groups: Record<string, Player[]> = {};
  for (const player of players) {
    const key = player.position && POSITION_X_FRACTION[player.position] ? player.position : DEFAULT_GROUP;
    groups[key] = groups[key] ? [...groups[key], player] : [player];
  }
  return groups;
}

// Computes a default grid formation, spreading each position group vertically
// at a fixed depth on the pitch. Pure function — no Konva/React dependency.
export function computeDefaultPositions(
  players: Player[],
  pitchWidth: number,
  pitchHeight: number,
): Record<string, PitchPosition> {
  const groups = groupByPosition(players);
  const positions: Record<string, PitchPosition> = {};
  const verticalMargin = pitchHeight * 0.12;
  const usableHeight = pitchHeight - verticalMargin * 2;

  for (const [groupKey, groupPlayers] of Object.entries(groups)) {
    const x = pitchWidth * (POSITION_X_FRACTION[groupKey] ?? POSITION_X_FRACTION[DEFAULT_GROUP] ?? 0.55);
    const step = usableHeight / (groupPlayers.length + 1);

    groupPlayers.forEach((player, index) => {
      positions[player.id] = {
        x,
        y: verticalMargin + step * (index + 1),
      };
    });
  }

  return positions;
}