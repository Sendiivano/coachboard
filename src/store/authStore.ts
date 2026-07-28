import { create } from 'zustand';
import type { AppUser } from '@/types';

interface AuthState {
  user: AppUser | null;
  isInitialized: boolean;
  setUser: (user: AppUser | null) => void;
  setInitialized: (value: boolean) => void;
}

// Holds only the current session snapshot — never fetched domain data.
// Populated by the Supabase onAuthStateChange listener in useSession.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (value) => set({ isInitialized: value }),
}));