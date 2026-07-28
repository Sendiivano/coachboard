import { supabase } from '@/lib/supabaseClient';
import type { Team, TeamInsert } from '../types/team.types';

// All raw Supabase calls for teams live here — hooks never call supabase directly.
export const teamApi = {
  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTeamById(teamId: string): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    if (error) throw error;
    return data;
  },

  async createTeam(team: TeamInsert): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTeam(teamId: string): Promise<void> {
    const { error } = await supabase.from('teams').delete().eq('id', teamId);
    if (error) throw error;
  },
};