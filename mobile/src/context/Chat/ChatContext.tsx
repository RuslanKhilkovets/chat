import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const [userChatsError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
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

  const {mutate: getUsers} = useAuthMutation({
    mutationFn: Api.users.getUsers,
    onSuccess: () => {
      setAllUsers(response.data.users);
    },
    onError: error => {
      setUserChatsError(error.message);
    },
  });

  useEffect(() => {
    getUsers();
  }, [userChats]);

  const {mutate: getUserChats, isLoading: isUserChatLoading} = useAuthMutation({
    mutationFn: Api.chats.findUserChats,
    onSuccess: response => {
      setUserChats(response.data);
    },
    onError: error => {
      setUserChatsError(error.message);
    },
  });

  useEffect(() => {
    getUserChats(user._id || 'nigga');
  }, [user, notifications]);

  const {mutate: getMessages, isLoading: isMessagesLoading} = useAuthMutation({
    mutationFn: Api.messages.getMessages,
    onSuccess: res => {
      setMessages(res.data);
    },
    onError: error => {
      setMessagesError(error.message);
    },
  });

  useEffect(() => {
    getMessages(currentChat?._id);
  }, [currentChat]);

  const {mutate: sendMessageMutation} = useAuthMutation({
    mutationFn: Api.messages.sendMessage,
    onSuccess: response => {
      setNewMessage(response);
      setMessages(prev => [...prev, response]);
    },
    onError: error => {
      setSendTextMessageError(error.message);
    },
  });

  const sendMessage = async (
    textMessage,
    sender,
    currentChatId,
    setTextMessage,
  ) => {
    const payload = JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage,
    });

    await sendMessageMutation(payload).then(() => {
      setTextMessage('');
    });
  };

  const updateCurrentChat = useCallback(chat => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId, secondId) => {
      try {
        const response = await Api.chats.createChat({firstId, secondId});

        const chatId = response.data._id;

        const chatExists = filteredChats?.some(chat => chat._id === chatId);
        if (!chatExists) {
          setUserChats(prevChats => [...prevChats, response.data]);
        }

        return response.data;
      } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
      }
    },
    [filteredChats, setUserChats],
  );

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
