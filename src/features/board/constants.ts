export const PITCH_WIDTH = 900;
export const PITCH_HEIGHT = 600;
export const TOKEN_RADIUS = 18;
export const PLAYER_TOKEN_COLOR = '#1565c0';
export const OPPOSITION_TOKEN_COLOR = '#c62828';

// Shared bounds check — used to decide whether a dropped/dragged token
// stays on the pitch or gets sent back to the bench/removed.
export function isWithinPitch(x: number, y: number): boolean {
  return x >= 0 && x <= PITCH_WIDTH && y >= 0 && y <= PITCH_HEIGHT;
}