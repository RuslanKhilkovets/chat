import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useChatContext} from '@/context/Chat/ChatContext';
import {
  useFetchLatestMessage,
  useFetchRecipient,
  useTypedSelector,
} from '@/hooks';

interface IChatItemProps {
  chat: any;
}

const ChatItem = ({chat}: IChatItemProps) => {
  const user = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  const navigateToChat = (id: string) => {
    navigate('Chat', {chat});
  };

  const {recipientUser} = useFetchRecipient(chat, user);
  const {onlineUsers} = useChatContext();

  const {latestMessage} = useFetchLatestMessage(chat);

  const isOnline = onlineUsers?.some(
    user => user?.userId === recipientUser?._id,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.chatItem}
      onPress={() => navigateToChat('dumb')}>
      <View style={styles.profilePic}>
        {isOnline && <View style={styles.onlineMark}></View>}
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{recipientUser?.name || 'N/A'}</Text>
        <Text style={styles.lastMsg}>{latestMessage?.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  chatItem: {
    padding: 10,
    gap: 15,
    backgroundColor: '#1a1a1a',
    paddingLeft: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#5d5d5d',
  },
  chatInfo: {gap: 10},
  userName: {
    fontSize: 20,
    color: 'yellow',
  },
  lastMsg: {color: 'yellow'},
  onlineMark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: '#41f10b',
  },
});
