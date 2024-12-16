import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useChatContext} from '@/context/Chat/ChatContext';
import {
  useFetchLatestMessage,
  useFetchRecipient,
  useTypedSelector,
} from '@/hooks';
import {unreadNotifications} from '@/helpers/unreadNotifications';
import {getAvatarColor} from '@/helpers';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IChatItemProps {
  chat: any;
}

const ChatItem = ({chat}: IChatItemProps) => {
  const user = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const {latestMessage} = useFetchLatestMessage(chat);
  const isLatestMessageMine = latestMessage?.senderId === user?._id;

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

  const getInitials = (name: string | undefined) => {
    if (!name) return 'N/A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.chatItem,
        {
          backgroundColor: theme[colorScheme].bgTertiary,
          borderBlockColor: theme[colorScheme].shadow,
        },
      ]}
      onPress={() => navigateToChat()}>
      <View
        style={[
          styles.profilePic,
          {backgroundColor: getAvatarColor(recipientUser?._id)},
        ]}>
        <Text
          style={[
            styles.profileInitials,
            {color: theme[colorScheme].textPrimary},
          ]}>
          {getInitials(recipientUser?.name)}
        </Text>
        {isOnline && <View style={styles.onlineMark} />}
      </View>
      <View style={styles.chatInfo}>
        <Text
          style={[
            styles.userName,
            {color: theme[colorScheme].textPrimary},
            thisUserNotifications?.length !== 0 && {fontWeight: '700'},
          ]}>
          {recipientUser?.name || 'N/A'}
        </Text>
        <View style={styles.rowBetween}>
          {latestMessage?.text && (
            <Text
              numberOfLines={1}
              style={[
                styles.lastMsg,
                thisUserNotifications?.length !== 0 && {fontWeight: '700'},
                {color: theme[colorScheme].textPrimary},
              ]}
              ellipsizeMode="tail">
              {isLatestMessageMine
                ? t('chats.You') + ': ' + latestMessage?.text
                : latestMessage?.text}
            </Text>
          )}
          {latestMessage?.messageType === 'audio' && (
            <Text
              numberOfLines={1}
              style={[styles.lastMsg, {color: theme[colorScheme].textPrimary}]}>
              {isLatestMessageMine
                ? t('chats.You') + ': ' + t('chats.VoiceMessage')
                : t('chats.VoiceMessage')}
            </Text>
          )}
          {thisUserNotifications?.length !== 0 && (
            <View
              style={[
                styles.notifications,
                {
                  backgroundColor: theme[colorScheme].textPrimary,
                },
              ]}>
              <Text
                style={[
                  styles.notificationsText,
                  {color: theme[colorScheme].bgPrimary},
                ]}>
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
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatItem: {
    padding: 10,
    gap: 15,
    paddingLeft: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileInitials: {
    color: 'yellow',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatInfo: {
    gap: 10,
    flex: 1,
  },
  userName: {
    fontSize: 20,
  },
  lastMsg: {
    flex: 1,
    marginRight: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onlineMark: {
    position: 'absolute',
    bottom: 3,
    right: 0,
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: '#41f10b',
  },
});
