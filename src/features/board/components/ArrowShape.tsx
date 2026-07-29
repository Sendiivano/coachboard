import { Arrow, Circle, Group } from 'react-konva';
import type Konva from 'konva';
import type { ArrowElement } from '../types/drawing.types';
import { useDrawingStore } from '../store/drawingStore';

interface ArrowShapeProps {
  element: ArrowElement;
}

// Arrows have two independently draggable endpoints rather than a single
// drag handle — coaches need to reshape the arrow, not just relocate it.
export function ArrowShape({ element }: ArrowShapeProps) {
  const updateElement = useDrawingStore((state) => state.updateElement);
  const [x1, y1, x2, y2] = element.points;

  function handleStartDrag(event: Konva.KonvaEventObject<DragEvent>) {
    updateElement(element.id, { points: [event.target.x(), event.target.y(), x2, y2] });
  }

  function handleEndDrag(event: Konva.KonvaEventObject<DragEvent>) {
    updateElement(element.id, { points: [x1, y1, event.target.x(), event.target.y()] });
  }

  return (
    <Group>
      <Arrow
        points={[x1, y1, x2, y2]}
        stroke="#fdd835"
        fill="#fdd835"
        strokeWidth={3}
        pointerLength={10}
        pointerWidth={10}
        listening={false}
      />
      <Circle x={x1} y={y1} radius={6} fill="#fdd835" opacity={0.01} draggable onDragEnd={handleStartDrag} />
      <Circle x={x2} y={y2} radius={6} fill="#fdd835" opacity={0.01} draggable onDragEnd={handleEndDrag} />
    </Group>
  );
}