import { useQuery } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';

export function usePlayers(teamId: string | undefined) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn: () => playerApi.getPlayersByTeam(teamId as string),
    enabled: Boolean(teamId),
  });
}