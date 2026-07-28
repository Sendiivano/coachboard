import { supabase } from '@/lib/supabaseClient';

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupPayload extends Credentials {
  fullName: string;
}

// All raw Supabase auth calls live here — hooks never call supabase directly.
export const authApi = {
  async login({ email, password }: Credentials) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signup({ email, password, fullName }: SignupPayload) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};