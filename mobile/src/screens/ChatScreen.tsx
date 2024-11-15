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

const ChatScreen = () => {
  const route = useRoute();
  const chat = route?.params?.chat;
  const user = useTypedSelector(state => state.user);

  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendMessage,
    updateCurrentChat,
  } = useChatContext();
  const [textMessage, setTextMessage] = useState<string>('');
  const {recipientUser} = useFetchRecipient(currentChat, user);

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
    }
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
    };
  }, []);

  return (
    <Screen title={recipientUser?.name}>
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
              />
              <View style={styles.inputContainer}>
                <Input
                  value={textMessage}
                  onChangeText={text => setTextMessage(text)}
                  placeholder="Message..."
                  endAdornment={
                    textMessage ? (
                      <Pressable onPress={handleSendMessage}>
                        <Icon name="send" color="yellow" size={20} />
                      </Pressable>
                    ) : null
                  }
                />
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
  },
});
