import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';
import type { TeamInsert } from '../types/team.types';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (team: TeamInsert) => teamApi.createTeam(team),
    onSuccess: () => {
      // Invalidate the teams list so it refetches with the new team included.
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}