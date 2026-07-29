import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formationApi } from '../api/formationApi';
import type { FormationData } from '../types/formation.types';

interface SaveFormationParams {
  teamId: string;
  name: string;
  formationData: FormationData;
}

export function useSaveFormation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, name, formationData }: SaveFormationParams) =>
      formationApi.createFormation(teamId, name, formationData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations', variables.teamId] });
    },
  });
}