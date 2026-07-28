import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useLogin();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ email, password }, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm" noValidate>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <Button type="submit" isLoading={isPending}>
        Log in
      </Button>
    </form>
  );
}