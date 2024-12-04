import React, {
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
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [page, setPage] = useState(1);
  const user = useTypedSelector(state => state.user);
  const recipientId = currentChat?.members?.find(id => id !== user?._id);

  const {mutate: findChatsByQueryString} = useAuthMutation({
    mutationFn: Api.chats.findChatsBySenderName,
    onSuccess: res => {
      setFilteredChats(res.data.chats);
    },
  });

  const {mutate: deleteChat} = useAuthMutation({
    mutationFn: Api.chats.delete,
    onSuccess: res => {
      const existChats = filteredChats.filter(
        chat => chat?._id !== res.data.chat._id,
      );
      setUserChats(existChats);
    },
  });

  const {mutate: readMessageMutation} = useAuthMutation({
    mutationFn: Api.messages.read,
    onSuccess: readMessage => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === readMessage._id
            ? {...message, isRead: true}
            : message,
        ),
      );
    },
  });

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
      userChats?.find(chat => chat._id === id);

    if (!checkIfChatExists(response?._id))
      setUserChats(prev => [...prev, response]);

    return response;
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
        return;
      }

      setNewMessage(response);
      setMessages(prev => [...prev, response]);
      setTextMessage('');
    },
    [],
  );

  const handleMessageRead = async (messageIds, chatId) => {
    const senderId = user?._id;

    if (socket && messageIds?.length) {
      await socket.emit('messageRead', {
        messageIds,
        chatId,
        senderId,
        recipientId,
      });

      setMessages(prev => {
        const updatedMessages = prev.map(message =>
          messageIds.includes(message?._id)
            ? {...message, isRead: true}
            : message,
        );

        return updatedMessages;
      });
    }
  };

  const readMessages = useCallback(
    messages => {
      if (!currentChat || !user || !messages?.length) return;

      const unreadMessageIds = messages
        .filter(message => !message?.isRead && message?.senderId !== user?._id)
        .map(message => message._id);

      if (unreadMessageIds.length) {
        handleMessageRead(unreadMessageIds, currentChat?._id);
      }
    },
    [currentChat, user],
  );

  const loadMoreMessages = async () => {
    if (!currentChat || !user._id) return;

    try {
      const response = await fetch(
        `${baseUrl}/messages/${currentChat?._id}?page=${page + 1}&limit=15`,
      );
      const data = await response.json();

      if (data.length > 0) {
        setMessages(prevMessages => [...data?.reverse(), ...prevMessages]);
        setPage(prev => ++prev);
      }
    } catch (error) {
      setMessagesError(error.message);
    }
  };

  useEffect(() => {
    if (socket === null) {
      return;
    }

    socket.emit('addNewUser', user?._id);

    socket.on('getOnlineUsers', response => {
      setOnlineUsers(response);
    });
    socket.on('getNotification', res => {
      setNotifications(prev => [...prev, res]);
    });

    const onMessageRead = ({chatId, messageId}) => {
      readMessageMutation({chatId, messageId});
    };

    socket.on('messageRead', onMessageRead);

    return () => {
      socket.off('getOnlineUsers');
      socket.off('getNotification');
      socket.off('messageRead', onMessageRead);
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null || currentChat === null) {
      return;
    }

    if (isTyping) {
      socket.emit('typingStart', {
        chatId: currentChat?._id,
        senderId: user._id,
        recipientId,
      });
    } else {
      socket.emit('typingStop', {
        chatId: currentChat?._id,
        senderId: user._id,
        recipientId,
      });
    }

    socket.on('typingStart', res => {
      if (res.senderId !== user._id && res.chatId === currentChat?._id) {
        setIsRecipientTyping(true);
      }
    });

    socket.on('typingStop', res => {
      if (res.senderId !== user._id && res.chatId === currentChat?._id) {
        setIsRecipientTyping(false);
      }
    });

    return () => {
      socket.off('typingStart');
      socket.off('typingStop');
    };
  }, [socket, isTyping, currentChat, user?._id]);

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

    return () => {
      socket.off('getMessage');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    if (currentChat && messages) {
      const unreadMessageIds = messages
        .filter(message => !message?.isRead && message?.senderId !== user?._id)
        .map(message => message._id);

      if (unreadMessageIds.length) {
        handleMessageRead(unreadMessageIds, currentChat?._id);
      }
    }
  }, [currentChat, messages]);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('messageRead', ({chatId, messageId}) => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === messageId ? {...message, isRead: true} : message,
        ),
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return;
      }
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);

      try {
        if (user._id) {
          const response = await fetch(`${baseUrl}/chats/${user._id}`);
          const data = await response.json();

          setUserChats(data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsUserChatsLoading(false);
      }
    };
    getUserChats();
  }, [user]);

  useEffect(() => {
    if (!currentChat) return;

    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        if (user._id) {
          const response = await fetch(
            `${baseUrl}/messages/${currentChat?._id}`,
          );
          const data = await response.json();

          setMessages(data?.reverse());
        }
      } catch (error) {
        setMessagesError(error.message);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    getMessages();
  }, [currentChat]);

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
    if (currentChat === null) {
      return;
    }

    socket.emit('sendMessage', {...newMessage, recipientId});
  }, [newMessage]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendMessage,
        newMessage,
        setNewMessage,
        onlineUsers,
        notifications,
        markAsRead,
        markThisUserNotificationsAsRead,
        filterQuery,
        setFilterQuery,
        filteredChats,
        isTyping,
        setIsTyping,
        isRecipientTyping,
        setIsRecipientTyping,
        readMessages,
        loadMoreMessages,
        page,
        setPage,
        deleteChat,
        recipientId,
        setMessages,
        socket,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
