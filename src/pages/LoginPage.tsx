import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-pitch-dark">Log in to CoachBoard</h1>
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}