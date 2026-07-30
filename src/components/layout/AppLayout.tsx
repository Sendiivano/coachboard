import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function AppLayout() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 bg-white border-b border-gray-200">
        <span className="text-lg font-semibold tracking-tight text-brand-700">CoachBoard</span>
        <Button variant="ghost" onClick={() => logout()} isLoading={isPending}>
          Log out
        </Button>
      </header>
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}