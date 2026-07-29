import { supabase } from '@/lib/supabaseClient';
import type { Json } from '@/types/database.types';
import type { SavedFormation, FormationData } from '../types/formation.types';

export const formationApi = {
  async getFormationsByTeam(teamId: string): Promise<SavedFormation[]> {
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('team_id', teamId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createFormation(teamId: string, name: string, formationData: FormationData): Promise<SavedFormation> {
    const { data, error } = await supabase
      .from('formations')
      .insert({ team_id: teamId, name, formation_data: formationData as unknown as Json })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateFormation(formationId: string, formationData: FormationData): Promise<SavedFormation> {
    const { data, error } = await supabase
      .from('formations')
      .update({ formation_data: formationData as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', formationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteFormation(formationId: string): Promise<void> {
    const { error } = await supabase.from('formations').delete().eq('id', formationId);
    if (error) throw error;
  },
};