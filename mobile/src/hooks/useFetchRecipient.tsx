import {useEffect, useState} from 'react';

import {useAuthMutation} from '../hooks/useAuthMutation';
import {Api} from '@/api';

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find(id => id !== user?._id);

  const {mutate: fetchRecipient, isLoading} = useAuthMutation({
    mutationFn: async recipientId => {
      return Api.users.findById(recipientId);
    },
    onSuccess: response => {
      setRecipientUser(response.data);
    },
    onError: error => {
      setError(error);
    },
  });

  useEffect(() => {
    if (!recipientId) return;

    fetchRecipient(recipientId);
  }, [recipientId]);

  return {recipientUser, error, isLoading};
};

export default useFetchRecipient;
