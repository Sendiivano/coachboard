import { Text } from 'react-konva';
import type Konva from 'konva';
import type { TextElement } from '../types/drawing.types';
import { useDrawingStore } from '../store/drawingStore';
import { isWithinPitch } from '../constants';

interface TextLabelShapeProps {
  element: TextElement;
}

export function TextLabelShape({ element }: TextLabelShapeProps) {
  const updateElement = useDrawingStore((state) => state.updateElement);
  const removeElement = useDrawingStore((state) => state.removeElement);

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    const x = event.target.x();
    const y = event.target.y();
    if (!isWithinPitch(x, y)) {
      removeElement(element.id);
      return;
    }
    updateElement(element.id, { x, y });
  }

  function handleDblClick() {
    const nextText = prompt('Edit label text:', element.text);
    if (nextText !== null) {
      updateElement(element.id, { text: nextText });
    }
  }

  return (
    <Text
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={14}
      fontStyle="bold"
      fill="#ffffff"
      stroke="#000000"
      strokeWidth={0.5}
      draggable
      onDragEnd={handleDragEnd}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    />
  );
}