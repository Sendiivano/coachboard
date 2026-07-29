import { useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { Pitch } from './Pitch';
import { PlayerToken } from './PlayerToken';
import { OppositionToken } from './OppositionToken';
import { useBoardStore } from '../store/boardStore';
import { useFormationStore } from '../store/formationStore';
import { useOppositionStore } from '../store/oppositionStore';
import { PITCH_WIDTH, PITCH_HEIGHT, isWithinPitch } from '../constants';
import type { Player } from '@/features/team/types/team.types';

interface TacticalBoardCanvasProps {
  players: Player[];
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.05;

export function TacticalBoardCanvas({ players }: TacticalBoardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: PITCH_WIDTH, height: PITCH_HEIGHT });

  const scale = useBoardStore((state) => state.scale);
  const position = useBoardStore((state) => state.position);
  const setScale = useBoardStore((state) => state.setScale);
  const setPosition = useBoardStore((state) => state.setPosition);

  const formationPositions = useFormationStore((state) => state.positions);
  const setPlayerPosition = useFormationStore((state) => state.setPosition);
  const removePlayerPosition = useFormationStore((state) => state.removePosition);

  const isOppositionVisible = useOppositionStore((state) => state.isVisible);
  const oppositionMarkers = useOppositionStore((state) => state.markers);

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

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    if (event.target === event.target.getStage()) {
      setPosition({ x: event.target.x(), y: event.target.y() });
    }
  }

  const displayScale = (containerSize.width / PITCH_WIDTH) * scale;

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    const playerId = event.dataTransfer.getData('text/plain');
    if (!playerId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropX = event.clientX - rect.left;
    const dropY = event.clientY - rect.top;

    const pitchX = (dropX - position.x) / displayScale;
    const pitchY = (dropY - position.y) / displayScale;

    // A drop from the sidebar that lands outside the pitch is simply ignored —
    // the player just stays on the bench rather than getting a half-set position.
    if (!isWithinPitch(pitchX, pitchY)) {
      removePlayerPosition(playerId);
      return;
    }

    setPlayerPosition(playerId, { x: pitchX, y: pitchY });
  }

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
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        className="rounded-lg border border-gray-300 shadow-sm"
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
      </Stage>
    </div>
  );
}