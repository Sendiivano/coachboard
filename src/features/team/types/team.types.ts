import type { Database } from '@/types/database.types';

export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];

export type Player = Database['public']['Tables']['players']['Row'];
export type PlayerInsert = Database['public']['Tables']['players']['Insert'];
export type PlayerUpdate = Database['public']['Tables']['players']['Update'];

export type SportType = 'football' | 'futsal' | 'mini_soccer';
export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';