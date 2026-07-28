import { useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { Pitch } from './Pitch';
import { useBoardStore } from '../store/boardStore';

const PITCH_WIDTH = 900;
const PITCH_HEIGHT = 600;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.05;

// Stage owns the raw pointer/wheel event handling (high-frequency, Konva-native).
// We only sync to Zustand at the end of a gesture, not on every intermediate frame.
export function TacticalBoardCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: PITCH_WIDTH, height: PITCH_HEIGHT });

  const scale = useBoardStore((state) => state.scale);
  const position = useBoardStore((state) => state.position);
  const setScale = useBoardStore((state) => state.setScale);
  const setPosition = useBoardStore((state) => state.setPosition);

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      const clampedWidth = Math.min(width, PITCH_WIDTH);
      const aspectRatio = PITCH_HEIGHT / PITCH_WIDTH;
      setContainerSize({ width: clampedWidth, height: clampedWidth * aspectRatio });
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  function handleWheel(event: Konva.KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();
    const stage = event.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = scale;
    const direction = event.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP;
    const clampedScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

    // Zoom toward the cursor position, not the canvas origin.
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    setPosition({ x: event.target.x(), y: event.target.y() });
  }

  const displayScale = (containerSize.width / PITCH_WIDTH) * scale;

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        scaleX={displayScale}
        scaleY={displayScale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        className="rounded-lg border border-gray-300 shadow-sm"
      >
        <Layer>
          <Pitch width={PITCH_WIDTH} height={PITCH_HEIGHT} />
        </Layer>
      </Stage>
    </div>
  );
}