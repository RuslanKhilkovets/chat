import { createContext, useEffect, useState } from 'react';
import { baseUrl } from '../utils/services';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatLoading(true);
      setUserChatsError(null);

      try {
        if (user._id) {
          const response = await fetch(`${baseUrl}/chats/${user._id}`);
          const data = await response.json();
          console.log(data);

          setUserChats(data);
        }
      } catch (error) {
        setUserChatsError(error.message);
      } finally {
        setIsUserChatLoading(false);
      }
    };
    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
