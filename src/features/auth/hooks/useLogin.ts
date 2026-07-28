import { useMutation } from '@tanstack/react-query';
import { authApi, type Credentials } from '../api/authApi';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: Credentials) => authApi.login(credentials),
  });
}