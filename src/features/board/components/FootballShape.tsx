import { Circle } from 'react-konva';
import type Konva from 'konva';
import type { FootballElement } from '../types/drawing.types';
import { useDrawingStore } from '../store/drawingStore';
import { useHistoryStore } from '../store/historyStore';
import { isWithinPitch } from '../constants';

interface FootballShapeProps {
  element: FootballElement;
}

const RADIUS = 8;

export function FootballShape({ element }: FootballShapeProps) {
  const updateElement = useDrawingStore((state) => state.updateElement);
  const removeElement = useDrawingStore((state) => state.removeElement);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    const x = event.target.x();
    const y = event.target.y();
    recordSnapshot();
    if (!isWithinPitch(x, y)) {
      removeElement(element.id);
      return;
    }
    updateElement(element.id, { x, y });
  }

  return (
    <Circle
      x={element.x}
      y={element.y}
      radius={RADIUS}
      fill="#ffffff"
      stroke="#111111"
      strokeWidth={1.5}
      draggable
      onDragEnd={handleDragEnd}
    />
  );
}