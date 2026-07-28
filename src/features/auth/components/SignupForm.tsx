import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSignup } from '../hooks/useSignup';

interface SignupFormProps {
  onSuccess: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useSignup();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ fullName, email, password }, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm" noValidate>
      <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
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
        minLength={8}
        autoComplete="new-password"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <Button type="submit" isLoading={isPending}>
        Create account
      </Button>
    </form>
  );
}