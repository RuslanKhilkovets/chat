import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {
  AudioStopper,
  Input,
  MessageItem,
  Screen,
  SendAudioButton,
} from '@/components';
import {useAudioRecorder, useFetchRecipient, useTypedSelector} from '@/hooks';
import {useChatContext} from '@/context/Chat/ChatContext';
import {unreadNotifications} from '@/helpers/unreadNotifications';
import {useTheme} from '@/context/Theme/ThemeContext';

const ChatScreen = () => {
  const route = useRoute();
  const chat = route?.params?.chat;
  const user = useTypedSelector(state => state.user);
  const {
    userChats,
    currentChat,
    messages,
    sendMessage,
    updateCurrentChat,
    isTyping,
    setIsTyping,
    isRecipientTyping,
    readMessages,
    notifications,
    markAsRead,
    loadMoreMessages,
    setPage,
    onlineUsers,
    isMessagesLoading,
    page,
    hasMoreMessages,
  } = useChatContext();
  const {isRecording, discardRecording, startRecording, stopRecording} =
    useAudioRecorder();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const [textMessage, setTextMessage] = useState<string>('');
  const [lastMessageId, setLastMessageId] = useState<string>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {recipientUser} = useFetchRecipient(currentChat, user);
  const unread = unreadNotifications(notifications);
  const thisUserNotifications = unread?.filter(
    n => n.senderId === recipientUser?._id,
  );
  const isOnline = onlineUsers?.some(
    user => user?.userId === recipientUser?._id,
  );
  let debounceTimeout: NodeJS.Timeout;

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 300);
  }, [lastMessageId]);

  useEffect(() => {
    setLastMessageId(messages?.[messages.length - 1]?._id);
  }, [messages]);

  useEffect(() => {
    if (page === 1) {
      scrollToBottom();
    }
  }, [isMessagesLoading, messages]);

  useEffect(() => {
    updateCurrentChat(chat);
  }, [chat]);

  useEffect(() => {
    return () => {
      updateCurrentChat(null);
      discardRecording();
      setPage(1);
    };
  }, []);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };

  const handleSendMessage = async () => {
    try {
      if (textMessage.trim()) {
        await sendMessage(textMessage, user, currentChat._id);
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        setTextMessage('');

        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleTextChange = (text: string) => {
    setTextMessage(text);

    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (thisUserNotifications.length > 0) {
      thisUserNotifications.forEach(n => {
        markAsRead(n, userChats, user, notifications);
      });
    }
  }, [thisUserNotifications]);

  const payload = {
    name: recipientUser?.name,
    userId: recipientUser?._id,
    isOnline,
    isTyping: isRecipientTyping,
    chatId: currentChat?._id,
  };

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    const visibleMessages = viewableItems.map(item => item.item);
    readMessages(visibleMessages);
  });

  const handleScroll = event => {
    event.persist();

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

      const isNearTop =
        contentOffset.y >= contentSize.height - layoutMeasurement.height - 300;

      if (isNearTop && !isMessagesLoading && hasMoreMessages) {
        loadMoreMessages();
      }
    }, 300);
  };

  return (
    <Screen chatMode payload={payload}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{flex: 1}}>
          {isMessagesLoading && (
            <View
              style={[
                styles.loader,
                {backgroundColor: theme[colorScheme].textPrimary},
                {zIndex: 2},
              ]}>
              <ActivityIndicator
                color={theme[colorScheme].bgPrimary}
                size={32}
              />
            </View>
          )}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({item}) => <MessageItem message={item} />}
            keyExtractor={item => item._id}
            style={{zIndex: 1}}
            contentContainerStyle={{
              flexGrow: 1, // Дозволяє контейнеру заповнювати доступний простір
              justifyContent: 'flex-end',
            }}
            onViewableItemsChanged={handleViewableItemsChanged.current}
            onScroll={handleScroll}
            inverted
            scrollEventThrottle={100}
          />
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: theme[colorScheme].bgPrimary},
            ]}>
            <Input
              disabled={isRecording}
              style={{flex: 1}}
              value={textMessage}
              onChangeText={handleTextChange}
              placeholder={t('chats.Message')}
              endAdornment={
                textMessage && textMessage?.trim() ? (
                  <Pressable onPress={handleSendMessage}>
                    <Icon
                      name="send"
                      color={theme[colorScheme].textPrimary}
                      size={20}
                    />
                  </Pressable>
                ) : null
              }
            />
            {isRecording && (
              <AudioStopper discardRecording={discardRecording} />
            )}
            {!textMessage.trim() && (
              <SendAudioButton
                startRecording={startRecording}
                stopRecording={async () => {
                  await stopRecording();
                  scrollToBottom();
                }}
                isRecording={isRecording}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  loader: {
    padding: 5,
    borderRadius: 25,
    position: 'absolute',
    left: '50%',
    top: 30,
    transform: [{translateX: -16}],
  },
});
