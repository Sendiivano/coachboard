import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formationApi } from '../api/formationApi';
import type { FormationData } from '../types/formation.types';

interface UpdateFormationParams {
  teamId: string;
  formationId: string;
  formationData: FormationData;
}

export function useUpdateFormation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formationId, formationData }: UpdateFormationParams) =>
      formationApi.updateFormation(formationId, formationData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations', variables.teamId] });
    },
  });
}