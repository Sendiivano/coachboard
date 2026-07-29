import { useQuery } from '@tanstack/react-query';
import { formationApi } from '../api/formationApi';

export function useFormations(teamId: string | undefined) {
  return useQuery({
    queryKey: ['formations', teamId],
    queryFn: () => formationApi.getFormationsByTeam(teamId as string),
    enabled: Boolean(teamId),
  });
}