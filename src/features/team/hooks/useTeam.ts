import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';

export function useTeam(teamId: string | undefined) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => teamApi.getTeamById(teamId as string),
    enabled: Boolean(teamId),
  });
}