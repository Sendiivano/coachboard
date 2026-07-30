import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card } from '@/components/ui/Card';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Log in to CoachBoard</p>
          </div>
          <LoginForm onSuccess={() => navigate('/dashboard')} />
          <p className="text-sm text-gray-500">
            No account?{' '}
            <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}