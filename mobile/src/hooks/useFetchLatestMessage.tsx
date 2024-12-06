import {useEffect, useState} from 'react';
import {baseUrl, getRequest} from '../helpers/services';
import {useChatContext} from '@/context/Chat/ChatContext';

export const useFetchLatestMessage = chat => {
  const {newMessage, notifications} = useChatContext();
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        console.log(response.error);

        return;
      }
      const lastMessage = response?.messages[0];

      setLatestMessage(lastMessage);
    };
    getMessage();
  }, [newMessage, notifications]);

  return {latestMessage};
};

export default useFetchLatestMessage;
