// Placeholder — replace by running:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
//
// Keeping a minimal manual shape now so the app compiles before codegen is run.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
        };
        Update: {
          full_name?: string | null;
        };
      };
    };
  };
}