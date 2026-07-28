import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: '/dashboard', element: <DashboardPage /> }],
      },
    ],
  },
  { path: '/', element: <LoginPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}