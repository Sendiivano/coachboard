import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';

export function useDeletePlayer(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerId: string) => playerApi.deletePlayer(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
  });
}