import { Group, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import type { Player } from '@/features/team/types/team.types';
import { useFormationStore } from '../store/formationStore';
import { useHistoryStore } from '../store/historyStore';
import { isWithinPitch, TOKEN_RADIUS, PLAYER_TOKEN_COLOR } from '../constants';

interface PlayerTokenProps {
  player: Player;
  x: number;
  y: number;
}

// Each token owns its own drag handling. Dragging outside the pitch bounds
// sends the player back to the bench (RosterSidebar) rather than letting
// them sit off-pitch — enforced here on drag end.
export function PlayerToken({ player, x, y }: PlayerTokenProps) {
  const setPosition = useFormationStore((state) => state.setPosition);
  const removePosition = useFormationStore((state) => state.removePosition);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    const nextX = event.target.x();
    const nextY = event.target.y();
    recordSnapshot();

    if (!isWithinPitch(nextX, nextY)) {
      removePosition(player.id);
      return;
    }
    setPosition(player.id, { x: nextX, y: nextY });
  }

  const initials = player.full_name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Group x={x} y={y} draggable onDragEnd={handleDragEnd}>
      <Circle radius={TOKEN_RADIUS} fill={PLAYER_TOKEN_COLOR} stroke="#ffffff" strokeWidth={2} />
      <Text
        text={player.jersey_number?.toString() ?? initials}
        fontSize={14}
        fontStyle="bold"
        fill="#ffffff"
        width={TOKEN_RADIUS * 2}
        height={TOKEN_RADIUS * 2}
        offsetX={TOKEN_RADIUS}
        offsetY={TOKEN_RADIUS}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
      <Text
        text={player.full_name}
        fontSize={11}
        fill="#ffffff"
        width={100}
        offsetX={50}
        offsetY={-TOKEN_RADIUS - 14}
        align="center"
        listening={false}
      />
    </Group>
  );
}