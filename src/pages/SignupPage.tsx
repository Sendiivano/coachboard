import { useNavigate, Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { Card } from '@/components/ui/Card';

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
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