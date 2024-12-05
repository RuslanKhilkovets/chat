import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AudioStopper,
  Input,
  MessageItem,
  Screen,
  SendAudioButton,
} from '@/components';
import {useRoute} from '@react-navigation/native';
import {useAudioRecorder, useFetchRecipient, useTypedSelector} from '@/hooks';
import {useChatContext} from '@/context/Chat/ChatContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {unreadNotifications} from '@/helpers/unreadNotifications';

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
  } = useChatContext();
  const {isRecording, discardRecording, startRecording, stopRecording} =
    useAudioRecorder();

  const [textMessage, setTextMessage] = useState<string>('');
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
    if (!isMessagesLoading && page === 1) {
      scrollToBottom();
    }
  }, [isMessagesLoading]);

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
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 200);
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
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottom();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
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
      const {contentOffset} = event.nativeEvent;

      const isAtTop = contentOffset.y <= 0;

      if (isAtTop && !isMessagesLoading) {
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
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({item}) => <MessageItem message={item} />}
              keyExtractor={item => item._id}
              style={{marginBottom: 20}}
              onEndReachedThreshold={0.5}
              onViewableItemsChanged={handleViewableItemsChanged.current}
              onScroll={handleScroll}
              scrollEventThrottle={100}
            />
            <View style={styles.inputContainer}>
              <Input
                disabled={isRecording}
                style={{flex: 1}}
                value={textMessage}
                onChangeText={handleTextChange}
                placeholder="Message..."
                endAdornment={
                  textMessage && textMessage?.trim() ? (
                    <Pressable onPress={handleSendMessage}>
                      <Icon name="send" color="yellow" size={20} />
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
          </>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#000',
    padding: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});
