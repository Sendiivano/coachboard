import { useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { Pitch } from './Pitch';
import { PlayerToken } from './PlayerToken';
import { OppositionToken } from './OppositionToken';
import { ConeShape } from './ConeShape';
import { FootballShape } from './FootballShape';
import { TextLabelShape } from './TextLabelShape';
import { ArrowShape } from './ArrowShape';
import { useBoardStore } from '../store/boardStore';
import { useFormationStore } from '../store/formationStore';
import { useOppositionStore } from '../store/oppositionStore';
import { useDrawingStore } from '../store/drawingStore';
import { useHistoryStore } from '../store/historyStore';
import { PITCH_WIDTH, PITCH_HEIGHT, isWithinPitch } from '../constants';
import type { Player } from '@/features/team/types/team.types';
import type { ArrowElement } from '../types/drawing.types';

interface TacticalBoardCanvasProps {
  players: Player[];
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.05;

export function TacticalBoardCanvas({ players }: TacticalBoardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: PITCH_WIDTH, height: PITCH_HEIGHT });
  const [pendingArrowStart, setPendingArrowStart] = useState<{ x: number; y: number } | null>(null);

  const scale = useBoardStore((state) => state.scale);
  const position = useBoardStore((state) => state.position);
  const setScale = useBoardStore((state) => state.setScale);
  const setPosition = useBoardStore((state) => state.setPosition);

  const formationPositions = useFormationStore((state) => state.positions);
  const setPlayerPosition = useFormationStore((state) => state.setPosition);
  const removePlayerPosition = useFormationStore((state) => state.removePosition);

  const isOppositionVisible = useOppositionStore((state) => state.isVisible);
  const oppositionMarkers = useOppositionStore((state) => state.markers);

  const selectedTool = useDrawingStore((state) => state.selectedTool);
  const drawingElements = useDrawingStore((state) => state.elements);
  const addElement = useDrawingStore((state) => state.addElement);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);

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

  function handleStageDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    if (event.target === event.target.getStage()) {
      setPosition({ x: event.target.x(), y: event.target.y() });
    }
  }

  const displayScale = (containerSize.width / PITCH_WIDTH) * scale;

  function getPitchPointerPosition(stage: Konva.Stage): { x: number; y: number } | null {
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    return {
      x: (pointer.x - position.x) / displayScale,
      y: (pointer.y - position.y) / displayScale,
    };
  }

  // Shared by mouse and touch — Konva normalizes getPointerPosition() for both,
  // so the actual placement logic only needs to live in one place.
  function handlePointerDown(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (selectedTool === 'select') return;
    const stage = event.target.getStage();
    if (!stage) return;
    const point = getPitchPointerPosition(stage);
    if (!point || !isWithinPitch(point.x, point.y)) return;

    if (selectedTool === 'arrow') {
      setPendingArrowStart(point);
      return;
    }

    if (selectedTool === 'cone') {
      recordSnapshot();
      addElement({ id: crypto.randomUUID(), type: 'cone', x: point.x, y: point.y });
    } else if (selectedTool === 'football') {
      recordSnapshot();
      addElement({ id: crypto.randomUUID(), type: 'football', x: point.x, y: point.y });
    } else if (selectedTool === 'text') {
      const text = prompt('Label text:', 'Note');
      if (text) {
        recordSnapshot();
        addElement({ id: crypto.randomUUID(), type: 'text', x: point.x, y: point.y, text });
      }
    }
  }

  function handlePointerUp(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (selectedTool !== 'arrow' || !pendingArrowStart) return;
    const stage = event.target.getStage();
    if (!stage) return;
    const point = getPitchPointerPosition(stage);
    if (!point) {
      setPendingArrowStart(null);
      return;
    }

    const arrow: ArrowElement = {
      id: crypto.randomUUID(),
      type: 'arrow',
      points: [pendingArrowStart.x, pendingArrowStart.y, point.x, point.y],
    };
    recordSnapshot();
    addElement(arrow);
    setPendingArrowStart(null);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    const playerId = event.dataTransfer.getData('text/plain');
    if (!playerId || !containerRef.current) return;
    recordSnapshot();

    const rect = containerRef.current.getBoundingClientRect();
    const dropX = event.clientX - rect.left;
    const dropY = event.clientY - rect.top;

    const pitchX = (dropX - position.x) / displayScale;
    const pitchY = (dropY - position.y) / displayScale;

    if (!isWithinPitch(pitchX, pitchY)) {
      removePlayerPosition(playerId);
      return;
    }

    setPlayerPosition(playerId, { x: pitchX, y: pitchY });
  }

  const isDrawingToolActive = selectedTool !== 'select';

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        scaleX={displayScale}
        scaleY={displayScale}
        x={position.x}
        y={position.y}
        draggable={!isDrawingToolActive}
        onWheel={handleWheel}
        onDragEnd={handleStageDragEnd}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        className={`rounded-lg border border-gray-300 shadow-sm ${isDrawingToolActive ? 'cursor-crosshair' : ''}`}
      >
        <Layer>
          <Pitch width={PITCH_WIDTH} height={PITCH_HEIGHT} />
        </Layer>
        <Layer>
          {players.map((player) => {
            const pos = formationPositions[player.id];
            if (!pos) return null;
            return <PlayerToken key={player.id} player={player} x={pos.x} y={pos.y} />;
          })}
        </Layer>
        {isOppositionVisible && (
          <Layer>
            {oppositionMarkers.map((marker) => (
              <OppositionToken key={marker.id} marker={marker} />
            ))}
          </Layer>
        )}
        <Layer>
          {drawingElements.map((element) => {
            if (element.type === 'cone') return <ConeShape key={element.id} element={element} />;
            if (element.type === 'football') return <FootballShape key={element.id} element={element} />;
            if (element.type === 'text') return <TextLabelShape key={element.id} element={element} />;
            if (element.type === 'arrow') return <ArrowShape key={element.id} element={element} />;
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}