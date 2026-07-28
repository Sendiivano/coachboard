import { useNavigate } from 'react-router-dom';
import { SignupForm } from '@/features/auth/components/SignupForm';

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-pitch-dark">Create your account</h1>
        <SignupForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}