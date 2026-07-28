import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';
import type { PlayerInsert } from '../types/team.types';

export function useCreatePlayer(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (player: PlayerInsert) => playerApi.createPlayer(player),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
  });
}