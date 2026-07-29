import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card } from '@/components/ui/Card';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
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