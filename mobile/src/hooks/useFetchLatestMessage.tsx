import {useEffect, useState} from 'react';
import {useAuthMutation} from '@/hooks/useAuthMutation';
import {useChatContext} from '@/context/Chat/ChatContext';
import {Api} from '@/api';

export const useFetchLatestMessage = chat => {
  const {newMessage, notifications} = useChatContext();
  const [latestMessage, setLatestMessage] = useState(null);

  const {mutate: fetchLatestMessage} = useAuthMutation({
    mutationFn: async chatId => {
      return Api.messages.getMessages({chatId});
    },
    onSuccess: response => {
      const lastMessage = response?.data.messages[0];
      setLatestMessage(lastMessage);
    },
    onError: error => {
      console.error('Error fetching latest message:', error);
    },
  });

  useEffect(() => {
    if (!chat?._id) return;

    fetchLatestMessage(chat._id);
  }, [newMessage, notifications]);

  return {latestMessage};
};

export default useFetchLatestMessage;
