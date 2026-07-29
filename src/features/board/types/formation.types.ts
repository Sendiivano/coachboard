import type { Database } from '@/types/database.types';
import type { PitchPosition } from '../utils/formationLayout';
import type { OppositionMarker } from '../store/oppositionStore';
import type { DrawingElement } from './drawing.types';

export type SavedFormation = Database['public']['Tables']['formations']['Row'];
export type SavedFormationInsert = Database['public']['Tables']['formations']['Insert'];
export type SavedFormationUpdate = Database['public']['Tables']['formations']['Update'];

// Shape stored inside the formation_data jsonb column — mirrors historyStore's
// snapshot shape deliberately, since both represent "the full board content."
export interface FormationData {
  formationPositions: Record<string, PitchPosition>;
  oppositionMarkers: OppositionMarker[];
  drawingElements: DrawingElement[];
}