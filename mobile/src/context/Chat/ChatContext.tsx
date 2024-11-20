import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {baseUrl, getRequest, postRequest} from '../../helpers/services';
import {io} from 'socket.io-client';
import {SERVER_URL} from '@env';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';

export const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({children}) => {
  const user = useTypedSelector(state => state.user);
  const [userChats, setUserChats] = useState([]);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  const {mutate: findChatsByQueryString} = useAuthMutation({
    mutationFn: Api.chats.findChatsBySenderName,
    onSuccess: res => {
      setFilteredChats(res.data.chats);
    },
  });

  useEffect(() => {
    userChats?.length !== 0 && setFilteredChats(userChats);
  }, [userChats]);

  useEffect(() => {
    const payload = {
      senderName: filterQuery,
      currentUserId: user?._id,
    };

    findChatsByQueryString(payload);
  }, [filterQuery]);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) {
      return;
    }

    socket.emit('addNewUser', user?._id);

    socket.on('getOnlineUsers', response => {
      setOnlineUsers(response);
    });

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket]);

  useEffect(() => {
    if (currentChat === null) {
      return;
    }

    const recipientId = currentChat?.members.find(id => id !== user?._id);

    socket.emit('sendMessage', {...newMessage, recipientId});
  }, [newMessage]);

  useEffect(() => {
    if (currentChat === null) {
      return;
    }

    socket.on('getMessage', res => {
      if (currentChat?._id !== res.chatId) {
        return;
      }

      setMessages(prev => [...prev, res]);
    });

    socket.on('getNotification', res => {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId);

      if (isChatOpen) {
        setNotifications(prev => [{...res, isRead: true}, ...prev]);
      } else {
        setNotifications(prev => [...prev, res]);
      }
    });

    return () => {
      socket.off('getMessage');
      socket.off('getNotification');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        setUserChatsError(response.message);
        return;
      }

      setAllUsers(response.users);
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
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        if (user._id) {
          const response = await fetch(
            `${baseUrl}/messages/${currentChat?._id}`,
          );
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

  const sendMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
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
    },
    [],
  );

  const updateCurrentChat = useCallback(chat => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({firstId, secondId}),
    );
    if (response.error) {
      throw new Error(response.message);
    }

    const checkIfChatExists = (id: string) =>
      userChats?.find(chat => chat._id === response?._id);

    if (!checkIfChatExists) setUserChats(prev => [...prev, response]);

    return response;
  }, []);

  const {mutate: createChatMutation} = useAuthMutation({
    mutationFn: Api.chats.createChat,
    onSuccess: res => {
      console.log(res);
    },
    onError: () => {},
  });

  const markAllAsRead = useCallback(notifications => {
    const mNotifications = notifications.map(notification => ({
      ...notification,
      id: notification.id,
      isRead: true,
    }));
    setNotifications(mNotifications);
  }, []);

  const markAsRead = useCallback((n, userChats, user, notifications) => {
    const desiredChat = userChats.find(chat => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every(member => {
        return chatMembers.includes(member);
      });
      return isDesiredChat;
    });

    const mNotifications = notifications.map(notification => {
      if (notification.senderId === n.senderId) {
        return {...n, isRead: true};
      } else {
        return notification;
      }
    });

    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
  }, []);

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications.map(not => {
        let notification;

        thisUserNotifications.forEach(n => {
          if (n.senderId === not.senderId) {
            notification = {...n, isRead: true};
          } else {
            notification = not;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
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
        onlineUsers,
        notifications,
        allUsers,
        markAllAsRead,
        markAsRead,
        markThisUserNotificationsAsRead,
        filterQuery,
        setFilterQuery,
        filteredChats,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
