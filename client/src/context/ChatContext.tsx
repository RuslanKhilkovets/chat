import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        setUserChatsError(response.message);
        return;
      }

      const pChats = response.users.filter(u => {
        let isChatCreated = false;
        if (user?._id === u.id) return false;

        if (userChats) {
          isChatCreated = userChats?.some(chat => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatLoading(true);
      setUserChatsError(null);

      try {
        if (user._id) {
          const response = await fetch(`${baseUrl}/chats/${user._id}`);
          const data = await response.json();

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

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        if (user._id) {
          const response = await fetch(`${baseUrl}/messages/${currentChat?._id}`);
          const data = await response.json();

          setMessages(data);
        }
      } catch (error) {
        setMessagesError(error.message);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    getMessages();
  }, [currentChat]);

  const sendMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) {
      throw new Error(`${currentChat} type smth`);
    }
    const response = await postRequest(
      `${baseUrl}/messages`,
      JSON.stringify({
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      }),
    );

    if (response.error) {
      setSendTextMessageError(response);
      return;
    }

    setNewMessage(response);
    setMessages(prev => [...prev, response]);
    setTextMessage('');
  }, []);

  const updateCurrentChat = useCallback(chat => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId }));
    if (response.error) {
      throw new Error(response.message);
    }
    setUserChats(prev => [...prev, response]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendMessage,
        sendTextMessageError,
        newMessage,
        setNewMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
