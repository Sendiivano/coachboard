import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';
import type { PlayerUpdate } from '../types/team.types';

interface UpdatePlayerParams {
  playerId: string;
  updates: PlayerUpdate;
}

export function useUpdatePlayer(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playerId, updates }: UpdatePlayerParams) => playerApi.updatePlayer(playerId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
  });
}