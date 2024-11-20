import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useChatContext} from '@/context/Chat/ChatContext';
import {
  useFetchLatestMessage,
  useFetchRecipient,
  useTypedSelector,
} from '@/hooks';
import {unreadNotifications} from '@/helpers/unreadNotifications';

interface IChatItemProps {
  chat: any;
}

const ChatItem = ({chat}: IChatItemProps) => {
  const user = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  const {latestMessage} = useFetchLatestMessage(chat);
  const {recipientUser} = useFetchRecipient(chat, user);
  const {onlineUsers, notifications, markThisUserNotificationsAsRead} =
    useChatContext();

  const unread = unreadNotifications(notifications);
  const thisUserNotifications = unread?.filter(
    n => n.senderId === recipientUser?._id,
  );
  const isOnline = onlineUsers?.some(
    user => user?.userId === recipientUser?._id,
  );

  const navigateToChat = () => {
    if (thisUserNotifications.length > 0) {
      markThisUserNotificationsAsRead(thisUserNotifications, notifications);
    }
    navigate('Chat', {chat});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.chatItem}
      onPress={() => navigateToChat()}>
      <View style={styles.profilePic}>
        {isOnline && <View style={styles.onlineMark} />}
      </View>
      <View style={styles.chatInfo}>
        <Text
          style={[
            styles.userName,
            thisUserNotifications?.length !== 0 && {fontWeight: 700},
          ]}>
          {recipientUser?.name || 'N/A'}
        </Text>
        <View style={styles.rowBetween}>
          <Text
            numberOfLines={1}
            style={[
              styles.lastMsg,
              thisUserNotifications?.length !== 0 && {fontWeight: 700},
            ]}
            ellipsizeMode="tail">
            {latestMessage?.text}
          </Text>
          {thisUserNotifications?.length !== 0 && (
            <View style={styles.notifications}>
              <Text style={styles.notificationsText}>
                {thisUserNotifications?.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  notifications: {
    height: 20,
    width: 20,
    backgroundColor: 'yellow',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsText: {
    color: '#000', // Контрастний текст для жовтого фону
    fontSize: 12,
    fontWeight: 'bold',
  },
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
  chatInfo: {
    gap: 10,
    flex: 1, // Дозволяє тексту займати весь доступний простір
  },
  userName: {
    fontSize: 20,
    color: 'yellow',
  },
  lastMsg: {
    color: 'yellow',
    flex: 1, // Дозволяє тексту займати максимум простору
    marginRight: 10, // Відступ між текстом і кількістю повідомлень
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
