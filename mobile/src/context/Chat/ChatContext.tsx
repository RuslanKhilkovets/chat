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
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';

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
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState(false);

  const audioRecorderPlayer = new AudioRecorderPlayer();

  let audioDurationLocal = 0;

  const startRecording = useCallback(async () => {
    setIsRecording(true);
    audioDurationLocal = 0;
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);

    setFile(uri);

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      audioDurationLocal = e.currentPosition / 1000;
    });
  }, []);

  const stopRecording = useCallback(async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);

    console.log('Final audio duration:', audioDurationLocal);
    uploadAudio(result, audioDurationLocal);
  }, []);

  const uploadAudio = useCallback(async (filePath, duration) => {
    const formData = new FormData();
    formData.append('audio', {
      uri: filePath,
      type: 'audio/m4a',
      name: 'sound.m4a',
    });

    formData.append('chatId', '673737d3732bff8fa0e51240');
    formData.append('senderId', '6735ba79ed6c19d6851bcc80');
    formData.append('duration', duration.toFixed(2));

    try {
      const response = await axios.post(`${baseUrl}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages(prev => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }, []);

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

  useEffect(() => {
    if (!socket) return;

    const onMessageRead = ({chatId, messageId}) => {
      readMessageMutation({chatId, messageId});
    };

    socket.on('messageRead', onMessageRead);

    return () => {
      socket.off('messageRead', onMessageRead);
    };
  }, [socket]);

  const handleMessageRead = async (messageIds, chatId) => {
    const recipientId = currentChat?.members.find(id => id !== user?._id);
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

  useEffect(() => {
    if (socket === null) {
      return;
    }

    socket.emit('addNewUser', user?._id);

    socket.on('getOnlineUsers', response => {
      setOnlineUsers(response);
    });
    socket.on('getNotification', res => {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId);

      console.log(isChatOpen);

      setNotifications(prev => [...prev, res]);
    });

    return () => {
      socket.off('getOnlineUsers');
      socket.off('getNotification');
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null || currentChat === null) {
      return;
    }

    const recipientId = currentChat.members.find(id => id !== user?._id);

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

  console.log(isRecipientTyping);

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

    return () => {
      socket.off('getMessage');
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
  }, [user]);

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
        isTyping,
        setIsTyping,
        isRecipientTyping,
        setIsRecipientTyping,
        readMessages,
        startRecording,
        stopRecording,
        uploadAudio,
        isRecording,
        setIsRecording,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
