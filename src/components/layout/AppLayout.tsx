import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function AppLayout() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <span className="font-bold text-lg text-pitch-dark">CoachBoard</span>
        <Button variant="secondary" onClick={() => logout()} isLoading={isPending}>
          Log out
        </Button>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}