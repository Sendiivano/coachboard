import { useSession } from '@/features/auth/hooks/useSession';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  useSession(); // hydrates authStore from Supabase on mount
  return <AppRouter />;
}