import {useContext} from 'react';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {AuthContext} from '@/context/Auth/AuthContext';

interface ErrorWithStatus {
  status?: number;
  message?: string;
}

interface MutationOptions<TData, TVariables, TError>
  extends UseMutationOptions<TData, TError, TVariables> {}

export const useAuthMutation = <
  TData,
  TVariables,
  TError extends ErrorWithStatus,
>(
  options: MutationOptions<TData, TVariables, TError>,
): UseMutationResult<TData, TError, TVariables> & {isLoading: boolean} => {
  const {logout} = useContext(AuthContext);

  const mutation = useMutation<TData, TError, TVariables>(options);

  if (mutation?.error?.status === 401 || mutation?.error?.status === 403) {
    logout();
  }

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export default useAuthMutation;
