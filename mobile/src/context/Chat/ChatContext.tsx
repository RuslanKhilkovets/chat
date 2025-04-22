import React, {
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
import {sendNotification} from '@/helpers';

export const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({children}) => {
  const [userChats, setUserChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
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
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const user = useTypedSelector(state => state.user);
  const recipientId = currentChat?.members?.find(id => id !== user?._id);
  const isRecipientOnline = onlineUsers?.some(
    user => user?.userId === recipientId,
  );

  const {mutate: findChatsByQueryString} = useAuthMutation({
    mutationFn: Api.chats.findChatsBySenderName,
    onSuccess: res => {
      setFilteredChats(res.data.chats);
    },
  });

  const {mutate: deleteChat} = useAuthMutation({
    mutationFn: Api.chats.delete,
    onSuccess: res => {
      const chatId = res.data.chat._id;

      setUserChats(prevChats => prevChats.filter(chat => chat?._id !== chatId));
      setFilteredChats(prevFilteredChats =>
        prevFilteredChats.filter(chat => chat?._id !== chatId),
      );
      socket?.emit('chatDeleted', res.data.chat._id);
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
    chat === null && setMessages([]);
    setCurrentChat(chat);
  }, []);

  const {mutateAsync: createChatMutate} = useAuthMutation({
    mutationFn: Api.chats.createChat,
    onSuccess: res => {
      setUserChats(prev => [...prev, res.data]);
      socket?.emit('chatCreated', {
        chatData: res.data,
      });
    },
    onError: error => {
      console.error('Error while creating chat', error);
    },
  });

  const createChat = useCallback(async (firstId, secondId) => {
    try {
      const response = await createChatMutate({firstId, secondId});
      return response.data;
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    }
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

  const {mutate: sendMessageMutate} = useAuthMutation({
    mutationFn: async ({chatId, senderId, textMessage, recipient, sender}) => {
      const response = await Api.messages.sendMessage({
        chatId,
        senderId,
        text: textMessage,
      });

      if (recipient && recipient.playerId && !isRecipientOnline) {
        try {
          await sendNotification({
            playerIds: [recipient?.playerId],
            title: `${sender.name}`,
            message: textMessage,
          });
        } catch (error) {
          console.error('Failed to send push notification:', error);
        }
      }

      return response;
    },
    onSuccess: response => {
      setNewMessage(response.data);
      setMessages(prev => [response.data, ...prev]);
    },
    onError: error => {
      console.error('Failed to send message:', error);
    },
  });

  const sendMessage = useCallback(
    (textMessage, sender, currentChatId, recipient) => {
      sendMessageMutate({
        chatId: currentChatId,
        senderId: sender._id,
        textMessage,
        recipient,
        sender,
      });
    },
    [sendMessageMutate],
  );

  const {mutate: editMessageMutate} = useAuthMutation({
    mutationFn: Api.messages.editMessage,
    onSuccess: response => {
      const updatedMessage = response.data;
      const {
        chatId,
        _id: messageId,
        text: newContent,
        senderId,
      } = updatedMessage;
      setMessages(prevMessages =>
        prevMessages?.map(message =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );
      socket?.emit('editMessage', {
        chatId,
        messageId,
        newContent,
        senderId,
        recipientId,
      });
    },
    onError: error => {
      console.error('Failed to edit message:', error);
    },
  });

  const editMessage = (messageId: string, text: string) => {
    editMessageMutate({messageId, text});
  };

  const {mutate: deleteMessageMutate} = useAuthMutation({
    mutationFn: Api.messages.deleteMessage,
    onSuccess: response => {
      const deletedMessage = response.data.data;
      const {chatId, _id, senderId} = deletedMessage;

      socket?.emit('deleteMessage', {
        chatId,
        messageId: _id,
        senderId,
        recipientId,
      });

      setMessages(prevMessages =>
        prevMessages?.filter(message => message._id !== deletedMessage._id),
      );
    },
    onError: error => {
      console.error('Failed to delete message:', error);
    },
  });

  const deleteMessage = (messageId: string) => {
    deleteMessageMutate(messageId);
  };

  useEffect(() => {
    if (!socket) return;

    const handleChatCreated = (chatData: ChatType) => {
      setFilteredChats(prev => {
        if (prev.some(chat => chat._id === chatData._id)) return prev;
        return [...prev, chatData];
      });
    };

    const handleChatDeleted = (chatId: string) => {
      setFilteredChats(prev => prev.filter(chat => chat._id !== chatId));
    };

    const handleMessageDeleted = ({messageId}) => {
      setMessages(prevMessages =>
        prevMessages.filter(message => message._id !== messageId),
      );
    };

    const handleMessageEdited = ({messageId, newContent}) => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === messageId ? {...message, text: newContent} : message,
        ),
      );
    };

    socket.on('deleteMessage', handleMessageDeleted);
    socket.on('editMessage', handleMessageEdited);
    socket.on('chatCreated', handleChatCreated);
    socket.on('chatDeleted', handleChatDeleted);

    return () => {
      socket.off('chatCreated', handleChatCreated);
      socket.off('chatDeleted', handleChatDeleted);
      socket.off('deleteMessage', handleChatCreated);
      socket.off('editMessage', handleChatDeleted);
    };
  }, [socket]);

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

  const {mutate: loadMessagesMutate, isLoading: isMessagesLoading} =
    useAuthMutation({
      mutationFn: Api.messages.getMessages,
      onSuccess: res => {
        const responseMessages = res?.data?.messages;

        if (responseMessages && responseMessages?.length !== 0) {
          setMessages(prevMessages => [...prevMessages, ...responseMessages]);
          setPage(prev => ++prev);
        }

        setHasMoreMessages(res?.data?.metadata?.hasMore);
      },
      onError: error => {
        setMessagesError(error?.message);
      },
    });

  const loadMoreMessages = async () => {
    if (!currentChat || !user._id) return;

    return await loadMessagesMutate({chatId: currentChat?._id, page});
  };

  useEffect(() => {
    if (socket === null) {
      return;
    }

    const onEditMessage = updatedMessage => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );
    };

    // Handle deleted message
    const onDeleteMessage = deletedMessageId => {
      setMessages(prevMessages =>
        prevMessages.filter(message => message._id !== deletedMessageId),
      );
    };

    socket.on('editMessage', onEditMessage);
    socket.on('deleteMessage', onDeleteMessage);

    return () => {
      socket.off('editMessage', onEditMessage);
      socket.off('deleteMessage', onDeleteMessage);
    };
  }, [socket]);

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
        senderId: user?._id,
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
      setMessages(prev => [res, ...prev]);
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

    newSocket.on('messageRead', ({messageId}) => {
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

  const {mutate: getUserChats, isLoading: isUserChatsLoading} = useAuthMutation(
    {
      mutationFn: Api.chats.findUserChats,
      onSuccess: res => {
        setUserChats(res.data);
      },
      onError: error => {
        console.log(error.message);
      },
    },
  );

  useEffect(() => {
    user?._id && getUserChats?.(user?._id);
  }, [user]);

  useEffect(() => {
    if (!currentChat) return;

    loadMessagesMutate({chatId: currentChat?._id, page: 1});
  }, [currentChat]);

  useEffect(() => {
    userChats?.length !== 0 && setFilteredChats(userChats);
  }, [userChats]);

  useEffect(() => {
    if (!user?._id) return;

    const payload = {
      senderName: filterQuery,
      currentUserId: user?._id,
    };

    findChatsByQueryString(payload);
  }, [filterQuery]);

  useEffect(() => {
    if (currentChat === null && !newMessage) {
      return;
    }

    socket.emit('sendMessage', {...newMessage, recipientId});
  }, [newMessage]);

  return (
    <ChatContext.Provider
      value={{
        setUserChats,
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
        hasMoreMessages,
        editMessage,
        deleteMessage,
        setFilteredChats,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
