import { useFormationStore } from '../store/formationStore';
import { useOppositionStore } from '../store/oppositionStore';
import { useDrawingStore } from '../store/drawingStore';
import { useCurrentFormationStore } from '../store/currentFormationStore';
import { useSaveFormation } from '../hooks/useSaveFormation';
import { useUpdateFormation } from '../hooks/useUpdateFormation';
import { Button } from '@/components/ui/Button';
import { promptDialog } from '@/store/modalStore';
import { toast } from '@/store/toastStore';
import type { FormationData } from '../types/formation.types';

interface FormationSaveControlsProps {
  teamId: string;
}

export function FormationSaveControls({ teamId }: FormationSaveControlsProps) {
  const formationPositions = useFormationStore((state) => state.positions);
  const oppositionMarkers = useOppositionStore((state) => state.markers);
  const drawingElements = useDrawingStore((state) => state.elements);

  const currentFormationId = useCurrentFormationStore((state) => state.currentFormationId);
  const currentFormationName = useCurrentFormationStore((state) => state.currentFormationName);
  const setCurrentFormation = useCurrentFormationStore((state) => state.setCurrentFormation);

  const { mutate: saveFormation, isPending: isSaving } = useSaveFormation();
  const { mutate: updateFormation, isPending: isUpdating } = useUpdateFormation();

  function buildCurrentSnapshot(): FormationData {
    return { formationPositions, oppositionMarkers, drawingElements };
  }

  async function handleSaveAsNew() {
    const name = await promptDialog('Name this formation:', currentFormationName ?? 'New formation');
    if (!name) return;

    saveFormation(
      { teamId, name, formationData: buildCurrentSnapshot() },
      {
        onSuccess: (formation) => {
          setCurrentFormation(formation.id, formation.name);
          toast.success(`Saved "${formation.name}"`);
        },
        onError: () => toast.error('Failed to save formation'),
      },
    );
  }

  function handleUpdateCurrent() {
    if (!currentFormationId) return;
    updateFormation(
      { teamId, formationId: currentFormationId, formationData: buildCurrentSnapshot() },
      {
        onSuccess: () => toast.success('Formation updated'),
        onError: () => toast.error('Failed to update formation'),
      },
    );
  }

  return (
    <div className="flex items-center gap-2">
      {currentFormationName && (
        <span className="text-sm text-gray-500">
          Editing: <span className="font-medium text-gray-700">{currentFormationName}</span>
        </span>
      )}
      {currentFormationId && (
        <Button variant="secondary" onClick={handleUpdateCurrent} isLoading={isUpdating}>
          Update
        </Button>
      )}
      <Button onClick={handleSaveAsNew} isLoading={isSaving}>
        Save as new
      </Button>
    </div>
  );
}