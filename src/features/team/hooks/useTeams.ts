import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamApi.getTeams(),
  });
}