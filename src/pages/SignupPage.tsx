import { useNavigate, Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { Card } from '@/components/ui/Card';

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Get started with CoachBoard</p>
          </div>
          <SignupForm onSuccess={() => navigate('/dashboard')} />
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}