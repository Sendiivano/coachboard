import { useFormations } from '../hooks/useFormations';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFormationStore } from '../store/formationStore';
import { useOppositionStore } from '../store/oppositionStore';
import { useDrawingStore } from '../store/drawingStore';
import { useCurrentFormationStore } from '../store/currentFormationStore';
import { useHistoryStore } from '../store/historyStore';
import type { FormationData } from '../types/formation.types';

interface FormationLoadDropdownProps {
  teamId: string;
}

export function FormationLoadDropdown({ teamId }: FormationLoadDropdownProps) {
  const { data: formations, isLoading } = useFormations(teamId);

  const replaceFormationPositions = useFormationStore((state) => state.replaceAll);
  const replaceOppositionMarkers = useOppositionStore((state) => state.replaceAll);
  const replaceDrawingElements = useDrawingStore((state) => state.replaceAll);
  const setCurrentFormation = useCurrentFormationStore((state) => state.setCurrentFormation);
  const recordSnapshot = useHistoryStore((state) => state.recordSnapshot);

  function handleLoad(formationId: string) {
    const formation = formations?.find((f) => f.id === formationId);
    if (!formation) return;

    const data = formation.formation_data as unknown as FormationData;

    recordSnapshot(); // loading is a mutation too — coach can undo back to their unsaved work
    replaceFormationPositions(data.formationPositions ?? {});
    replaceOppositionMarkers(data.oppositionMarkers ?? []);
    replaceDrawingElements(data.drawingElements ?? []);
    setCurrentFormation(formation.id, formation.name);
  }

  if (isLoading) return <Skeleton className="h-9 w-40" />;
  if (!formations || formations.length === 0) {
    return <p className="text-sm text-gray-400">No saved formations yet.</p>;
  }

  return (
    <select
      onChange={(e) => e.target.value && handleLoad(e.target.value)}
      defaultValue=""
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pitch"
      aria-label="Load a saved formation"
    >
      <option value="" disabled>
        Load formation…
      </option>
      {formations.map((formation) => (
        <option key={formation.id} value={formation.id}>
          {formation.name}
        </option>
      ))}
    </select>
  );
}