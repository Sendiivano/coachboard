import { useSession } from '@/features/auth/hooks/useSession';
import { AppRouter } from '@/routes/AppRouter';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ModalRoot } from '@/components/ui/ModalRoot';

export default function App() {
  useSession();
  return (
    <>
      <AppRouter />
      <ToastContainer />
      <ModalRoot />
    </>
  );
}