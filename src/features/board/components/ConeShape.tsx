import { RegularPolygon } from 'react-konva';
import type Konva from 'konva';
import type { ConeElement } from '../types/drawing.types';
import { useDrawingStore } from '../store/drawingStore';
import { useHistoryStore } from '../store/historyStore';
import { isWithinPitch } from '../constants';

interface ConeShapeProps {
  element: ConeElement;
}

export function ConeShape({ element }: ConeShapeProps) {
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
    <RegularPolygon
      x={element.x}
      y={element.y}
      sides={3}
      radius={12}
      fill="#f57c00"
      stroke="#ffffff"
      strokeWidth={1.5}
      draggable
      onDragEnd={handleDragEnd}
    />
  );
}