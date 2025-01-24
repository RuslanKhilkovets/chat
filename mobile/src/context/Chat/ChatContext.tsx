import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {io, Socket} from 'socket.io-client';

import {SERVER_URL} from '@env';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';
import {sendNotification} from '@/helpers';
import {IChat, IMessage, IUser} from '@/types';
import {UseMutateFunction} from '@tanstack/react-query';

interface ChatContextProps extends React.PropsWithChildren {}

interface IChatContext {
  userChats: IChat[];
  isUserChatsLoading: boolean;
  createChat: (firstId: string, secondId: string) => Promise<IChat>;
  updateCurrentChat: (chat: IChat) => void;
  messages: IMessage[];
  isMessagesLoading: boolean;
  messagesError: string | null;
  currentChat: IChat | null;
  sendMessage: (
    textMessage: string,
    sender: IUser,
    currentChatId: string,
    recipient: IUser,
  ) => void;
  newMessage: IMessage | null;
  setNewMessage: (message: IMessage | null) => void;
  onlineUsers: {userId: string; socketId: string}[];
  notifications: {date: string; isRead: boolean; senderId: string}[];
  markAsRead: (
    n: any,
    userChats: IChat[],
    user: IUser,
    notifications: any,
  ) => void;
  markThisUserNotificationsAsRead: (
    thisUserNotifications: any,
    notifications: any,
  ) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  filteredChats: IChat[];
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  isRecipientTyping: boolean;
  setIsRecipientTyping: (isTyping: boolean) => void;
  readMessages: (messages: IMessage[]) => void;
  loadMoreMessages: () => void;
  page: number;
  setPage: (page: number) => void;
  deleteChat: UseMutateFunction<{data: {chat: IChat}}, any, any, unknown>;
  recipientId?: string;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  socket: Socket | null;
  hasMoreMessages: boolean;
  editMessage: (messageId: string, text: string) => void;
  deleteMessage: (messageId: string) => void;
}

const initialContext: IChatContext = {
  userChats: [],
  isUserChatsLoading: false,
  createChat: async () => new Promise(() => ({id: '', name: ''})),
  updateCurrentChat: () => {},
  messages: [],
  isMessagesLoading: false,
  messagesError: null,
  currentChat: null,
  sendMessage: () => {},
  newMessage: null,
  setNewMessage: () => {},
  onlineUsers: [],
  notifications: [],
  markAsRead: () => {},
  markThisUserNotificationsAsRead: () => {},
  filterQuery: '',
  setFilterQuery: () => {},
  filteredChats: [],
  isTyping: false,
  setIsTyping: () => {},
  isRecipientTyping: false,
  setIsRecipientTyping: () => {},
  readMessages: () => {},
  loadMoreMessages: () => {},
  page: 1,
  setPage: () => {},
  deleteChat: () => {},
  recipientId: undefined,
  setMessages: () => {},
  socket: null,
  hasMoreMessages: true,
  editMessage: () => {},
  deleteMessage: () => {},
};

export const ChatContext = createContext<IChatContext>(initialContext);

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({children}: ChatContextProps) => {
  const [userChats, setUserChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<IMessage | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<
    {userId: string; socketId: string}[]
  >([]);
  const [notifications, setNotifications] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<IChat[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const user = useTypedSelector(state => state.user);
  const recipientId = currentChat?.members?.find(id => id !== user?._id);

  const {mutate: findChatsByQueryString} = useAuthMutation({
    mutationFn: Api.chats.findChatsBySenderName,
    onSuccess: (res: {data: {chats: IChat[]}}) => {
      setFilteredChats(res.data.chats);
    },
  });

  const {mutate: deleteChat} = useAuthMutation({
    mutationFn: Api.chats.delete,
    onSuccess: (res: {data: {chat: IChat}}) => {
      const chatId = res.data.chat._id;

      setUserChats(prevChats =>
        prevChats.filter((chat: IChat) => chat?._id !== chatId),
      );
      setFilteredChats(prevFilteredChats =>
        prevFilteredChats.filter((chat: IChat) => chat?._id !== chatId),
      );
    },
  });

  const {mutate: readMessageMutation} = useAuthMutation({
    mutationFn: Api.messages.read,
    onSuccess: (readMessage: IMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === readMessage._id
            ? {...message, isRead: true}
            : message,
        ),
      );
    },
  });

  const updateCurrentChat = useCallback((chat: IChat) => {
    chat === null && setMessages([]);
    setCurrentChat(chat);
  }, []);

  const {mutateAsync: createChatMutate} = useAuthMutation({
    mutationFn: Api.chats.createChat,
    onSuccess: (res: {data: IChat}) => {
      setUserChats(prev => [...prev, res.data]);
    },
    onError: (error: any) => {
      console.error('Error while creating chat', error);
    },
  });

  const markAsRead = useCallback(
    (n, userChats: IChat[], user: IUser, notifications) => {
      const desiredChat = userChats.find((chat: IChat) => {
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
    },
    [updateCurrentChat],
  );

  const createChat = useCallback(
    async (firstId: string, secondId: string) => {
      try {
        const response = await createChatMutate({firstId, secondId});
        return response.data;
      } catch (error) {
        console.error('Failed to create chat:', error);
        throw error;
      }
    },
    [createChatMutate],
  );

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
    mutationFn: async ({
      chatId,
      senderId,
      textMessage,
      recipient,
      sender,
    }: {
      chatId: string;
      senderId: string;
      textMessage: string;
      recipient: {playerId: string};
      sender: {name: string};
    }) => {
      const response = await Api.messages.sendMessage({
        chatId,
        senderId,
        text: textMessage,
      });

      if (recipient && recipient.playerId) {
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
    onSuccess: (response: {data: IMessage}) => {
      setNewMessage(response.data);
      setMessages(prev => [response.data, ...prev]);
    },
    onError: error => {
      console.error('Failed to send message:', error.message);
    },
  });

  const {mutate: editMessageMutate} = useAuthMutation({
    mutationFn: Api.messages.editMessage,
    onSuccess: (response: {data: IMessage}) => {
      const updatedMessage = response.data;
      setMessages(prevMessages =>
        prevMessages?.map(message =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );
    },
    onError: error => {
      console.error('Failed to edit message:', error.message);
    },
  });

  const editMessage = (messageId: string, text: string) => {
    editMessageMutate({messageId, text});
  };

  const {mutate: deleteMessageMutate} = useAuthMutation({
    mutationFn: Api.messages.deleteMessage,
    onSuccess: (response: {data: {data: IMessage}}) => {
      const deletedMessage = response.data.data;

      setMessages(prevMessages =>
        prevMessages?.filter(message => message._id !== deletedMessage._id),
      );
    },
    onError: error => {
      console.error('Failed to delete message:', error.message);
    },
  });

  const deleteMessage = (messageId: string) => {
    deleteMessageMutate(messageId);
  };

  const sendMessage = useCallback(
    (
      textMessage: string,
      sender: IUser,
      currentChatId: string,
      recipient: IUser,
    ) => {
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

  const handleMessageRead = useCallback(
    async (messageIds: string[], chatId: string): Promise<void> => {
      const senderId = user?._id;

      if (socket && messageIds?.length) {
        socket.emit('messageRead', {
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
    },
    [recipientId, socket, user?._id],
  );

  const readMessages = useCallback(
    (messagesToUpdate: IMessage[]) => {
      if (!currentChat || !user || !messages?.length) {
        return;
      }

      const unreadMessageIds = messagesToUpdate
        .filter(message => !message?.isRead && message?.senderId !== user?._id)
        .map(message => message._id);

      if (unreadMessageIds.length) {
        handleMessageRead(unreadMessageIds, currentChat?._id);
      }
    },
    [currentChat, user, handleMessageRead, messages],
  );

  const {mutate: loadMessagesMutate, isLoading: isMessagesLoading} =
    useAuthMutation({
      mutationFn: Api.messages.getMessages,
      onSuccess: (res: {data: {messages: IMessage[]; metadata: any}}) => {
        const responseMessages = res?.data?.messages;

        if (responseMessages && responseMessages?.length !== 0) {
          setMessages(prevMessages => [...prevMessages, ...responseMessages]);
          setPage(prev => ++prev);
        }

        setHasMoreMessages(res?.data?.metadata?.hasMore);
      },
      onError: (error: {message: string}) => {
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

    const onEditMessage = (updatedMessage: IMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );
    };

    const onDeleteMessage = (deletedMessageId: string) => {
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
    if (socket === null || user === null) {
      return;
    }

    socket!.emit('addNewUser', user?._id);

    socket!.on('getOnlineUsers', response => {
      setOnlineUsers(response);
    });

    socket!.on('getNotification', res => {
      setNotifications(prev => [...prev, res]);
    });

    const onMessageRead = ({
      chatId,
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => {
      readMessageMutation({chatId, messageId});
    };

    socket!.on('messageRead', onMessageRead);

    return () => {
      socket!.off('getOnlineUsers');
      socket!.off('getNotification');
      socket!.off('messageRead', onMessageRead);
    };
  }, [socket, user, readMessageMutation]);

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
  }, [socket, isTyping, currentChat, user?._id, recipientId]);

  useEffect(() => {
    if (currentChat === null && socket === null) {
      return;
    }

    socket?.on('getMessage', res => {
      if (currentChat?._id !== res.chatId) {
        return;
      }
      setMessages(prev => [res, ...prev]);
    });

    return () => {
      socket?.off('getMessage');
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
  }, [currentChat, messages, handleMessageRead, user?._id]);

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
      onSuccess: (res: {data: IChat[]}) => {
        setUserChats(res.data);
      },
      onError: (error: any) => {
        console.log(error.message);
      },
    },
  );

  useEffect(() => {
    user?._id && getUserChats?.(user?._id);
  }, [user, getUserChats]);

  useEffect(() => {
    if (!currentChat) {
      return;
    }

    loadMessagesMutate({chatId: currentChat?._id, page: 1});
  }, [currentChat, loadMessagesMutate]);

  useEffect(() => {
    userChats?.length !== 0 && setFilteredChats(userChats);
  }, [userChats]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const payload = {
      senderName: filterQuery,
      currentUserId: user?._id,
    };

    findChatsByQueryString(payload);
  }, [filterQuery, findChatsByQueryString, user?._id]);

  useEffect(() => {
    if (currentChat === null && socket === null) {
      return;
    }

    socket?.emit('sendMessage', {...newMessage, recipientId});
  }, [newMessage, socket, recipientId, currentChat]);

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
        hasMoreMessages,
        editMessage,
        deleteMessage,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
