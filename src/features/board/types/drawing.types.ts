export type DrawingTool = 'select' | 'arrow' | 'cone' | 'football' | 'text';

interface BaseElement {
  id: string;
}

export interface ArrowElement extends BaseElement {
  type: 'arrow';
  points: [number, number, number, number]; // x1, y1, x2, y2
}

export interface ConeElement extends BaseElement {
  type: 'cone';
  x: number;
  y: number;
}

export interface FootballElement extends BaseElement {
  type: 'football';
  x: number;
  y: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  x: number;
  y: number;
  text: string;
}

export type DrawingElement = ArrowElement | ConeElement | FootballElement | TextElement;