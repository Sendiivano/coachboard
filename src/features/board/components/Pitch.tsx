import { Rect, Line, Circle } from 'react-konva';

interface PitchProps {
  width: number;
  height: number;
}

const LINE_COLOR = '#ffffff';
const LINE_WIDTH = 2;

// Static pitch markings drawn to scale relative to the given width/height.
// Isolated from draggable elements so it never re-renders during drag/zoom of other layers.
export function Pitch({ width, height }: PitchProps) {
  const margin = width * 0.03;
  const centerX = width / 2;
  const centerY = height / 2;
  const centerRadius = width * 0.08;
  const penaltyBoxWidth = width * 0.16;
  const penaltyBoxHeight = height * 0.4;

  return (
    <>
      <Rect x={0} y={0} width={width} height={height} fill="#2e7d32" />

      {/* Outer boundary */}
      <Rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      {/* Halfway line */}
      <Line
        points={[centerX, margin, centerX, height - margin]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      {/* Center circle + spot */}
      <Circle x={centerX} y={centerY} radius={centerRadius} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
      <Circle x={centerX} y={centerY} radius={3} fill={LINE_COLOR} />

      {/* Left penalty box */}
      <Rect
        x={margin}
        y={centerY - penaltyBoxHeight / 2}
        width={penaltyBoxWidth}
        height={penaltyBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      {/* Right penalty box */}
      <Rect
        x={width - margin - penaltyBoxWidth}
        y={centerY - penaltyBoxHeight / 2}
        width={penaltyBoxWidth}
        height={penaltyBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
    </>
  );
}