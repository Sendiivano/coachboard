import { Group, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { useOppositionStore, type OppositionMarker } from '../store/oppositionStore';
import { isWithinPitch, TOKEN_RADIUS, OPPOSITION_TOKEN_COLOR } from '../constants';

interface OppositionTokenProps {
  marker: OppositionMarker;
}

// Visually distinct (red) from friendly player tokens (green) so coaches
// never confuse the two at a glance during a tactical session.
export function OppositionToken({ marker }: OppositionTokenProps) {
  const setMarkerPosition = useOppositionStore((state) => state.setMarkerPosition);
  const removeMarker = useOppositionStore((state) => state.removeMarker);

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    const nextX = event.target.x();
    const nextY = event.target.y();

    if (!isWithinPitch(nextX, nextY)) {
      removeMarker(marker.id);
      return;
    }
    setMarkerPosition(marker.id, nextX, nextY);
  }

  return (
    <Group x={marker.x} y={marker.y} draggable onDragEnd={handleDragEnd}>
      <Circle radius={TOKEN_RADIUS} fill={OPPOSITION_TOKEN_COLOR} stroke="#ffffff" strokeWidth={2} />
      <Text
        text={marker.label}
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
    </Group>
  );
}