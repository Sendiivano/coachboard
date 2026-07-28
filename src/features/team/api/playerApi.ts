import { supabase } from '@/lib/supabaseClient';
import type { Player, PlayerInsert, PlayerUpdate } from '../types/team.types';

// All raw Supabase calls for players live here — hooks never call supabase directly.
export const playerApi = {
  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId)
      .order('jersey_number', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createPlayer(player: PlayerInsert): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePlayer(playerId: string, updates: PlayerUpdate): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', playerId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deletePlayer(playerId: string): Promise<void> {
    const { error } = await supabase.from('players').delete().eq('id', playerId);
    if (error) throw error;
  },
};