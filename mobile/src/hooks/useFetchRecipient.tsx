import {useEffect, useState} from 'react';

import {useAuthMutation} from '../hooks/useAuthMutation';
import {Api} from '@/api';
import {IChat, IUser} from '@/types';

export const useFetchRecipient = (
  chat: IChat,
  user: IUser,
): {
  recipientUser: IUser | null;
  error: string;
  isLoading: boolean;
} => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState('');

  const recipientId = chat?.members.find(id => id !== user?._id);

  const {mutate: fetchRecipient, isLoading} = useAuthMutation({
    mutationFn: async (recipientId: string) => {
      return Api.users.findById(recipientId);
    },
    onSuccess: response => {
      setRecipientUser(response.data);
    },
    onError: error => {
      setError(error.message || 'Failed to fetch recipient');
    },
  });

  useEffect(() => {
    if (!recipientId) {
      return;
    }

    fetchRecipient(recipientId);
  }, [recipientId, fetchRecipient]);

  return {recipientUser, error, isLoading};
};
export default useFetchRecipient;
