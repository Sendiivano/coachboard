import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';

export function useToggleStarter(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playerId, isStarter }: { playerId: string; isStarter: boolean }) =>
      playerApi.updatePlayer(playerId, { is_starter: isStarter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
  });
}