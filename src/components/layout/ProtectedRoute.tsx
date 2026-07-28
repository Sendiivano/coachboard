import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Composition wrapper, not a HOC — sits directly in the route tree.
export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center" role="status">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}