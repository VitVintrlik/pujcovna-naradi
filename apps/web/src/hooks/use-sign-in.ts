import { useMutation } from '@tanstack/react-query';
import { signIn } from '../api/client';

export const useSignIn = () => useMutation({ mutationFn: signIn });
