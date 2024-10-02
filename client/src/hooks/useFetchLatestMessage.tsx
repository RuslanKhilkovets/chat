import { useContext, useEffect, useState } from 'react';
import { baseUrl, getRequest } from '../utils/services';
import { ChatContext } from '../context/ChatContext';

export const useFetchLatestMessage = chat => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        console.log(response.error);

        return;
      }

      const lastMessage = response[response?.length - 1];
      setLatestMessage(lastMessage);
    };
    getMessage();
  }, [newMessage, notifications]);

  return { latestMessage };
};
