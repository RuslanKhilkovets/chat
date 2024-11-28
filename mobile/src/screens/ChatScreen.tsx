import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Input, MessageItem, Screen} from '@/components';
import {useRoute} from '@react-navigation/native';
import {useFetchRecipient, useTypedSelector} from '@/hooks';
import {useChatContext} from '@/context/Chat/ChatContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {unreadNotifications} from '@/helpers/unreadNotifications';
import AudioMessageSender from '@/components/base/AudioSender';

const ChatScreen = () => {
  const route = useRoute();
  const chat = route?.params?.chat;
  const user = useTypedSelector(state => state.user);
  const {onlineUsers} = useChatContext();

  const {
    userChats,
    currentChat,
    messages,
    isMessagesLoading,
    sendMessage,
    updateCurrentChat,
    isTyping,
    setIsTyping,
    isRecipientTyping,
    readMessages,
    notifications,
    markAsRead,
  } = useChatContext();

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

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    updateCurrentChat(chat);
  }, [chat]);

  useEffect(() => {
    return () => {
      updateCurrentChat(null);
    };
  }, []);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (textMessage.trim()) {
      sendMessage(textMessage, user, currentChat._id, setTextMessage);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
  };

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    const visibleMessages = viewableItems.map(item => item.item);
    readMessages(visibleMessages);
  });

  return (
    <Screen chatMode payload={payload}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{flex: 1}}>
          {isMessagesLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'large'} color={'yellow'} />
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({item}) => <MessageItem message={item} />}
                keyExtractor={item => item._id}
                style={{marginBottom: 20}}
                onContentSizeChange={scrollToBottom}
                onEndReached={() => {
                  if (!isMessagesLoading) {
                    //loadMoreMessages();
                  }
                }}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={handleViewableItemsChanged.current}
              />
              <View style={styles.inputContainer}>
                <Input
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
                {!textMessage.trim() && (
                  <AudioMessageSender chatId={currentChat?._id} />
                )}
              </View>
            </>
          )}
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
    gap: 20,
  },
});
