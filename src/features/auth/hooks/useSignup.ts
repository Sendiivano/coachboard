import { useMutation } from '@tanstack/react-query';
import { authApi, type SignupPayload } from '../api/authApi';

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
  });
}