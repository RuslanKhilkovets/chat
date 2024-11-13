import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IModalProps} from '@/types';
import {Drawer} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {unreadNotifications} from '@/helpers/unreadNotifications';
import {useTypedSelector} from '@/hooks';
import moment from 'moment';

interface NotificationDrawerProps extends IModalProps {}

const NotificationDrawer = ({visible, onClose}: NotificationDrawerProps) => {
  const {user} = useTypedSelector(state => state);
  const {notifications, userChats, allUsers, markAllAsRead, markAsRead} =
    useChatContext();

  const unread = unreadNotifications(notifications);

  const modifiedNotifications = notifications.map(notification => {
    const senderId = allUsers.find(user => user._id === notification.senderId);

    return {
      ...notification,
      senderName: senderId?.name,
    };
  });
  console.log(unread);

  return (
    <Drawer visible={visible} onClose={onClose} openFrom="right">
      {/* {unread?.length === 0 ? null : <Text>{unread?.length}</Text>} */}

      <Text style={styles.title}>Notifications</Text>

      <Pressable onPress={() => markAllAsRead(notifications)}>
        <Text>Mark all as read</Text>
      </Pressable>

      {modifiedNotifications?.length === 0 ? (
        <Text>No notification yet...</Text>
      ) : null}

      {modifiedNotifications && (
        <FlatList
          data={modifiedNotifications}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  markAsRead(item, userChats, user, notifications);
                }}
                // className={
                //   item.isRead ? 'notification' : 'notification not-read'
                // }
              >
                <Text>{`${item.senderName} sent you a message`}</Text>
                <Text
                // className="notification-time"
                >{`${moment(item.date).calendar()}`}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </Drawer>
  );
};

export default NotificationDrawer;

const styles = StyleSheet.create({
  title: {
    color: 'yellow',
    textAlign: 'right',
    fontSize: 32,
    fontFamily: 'Jersey20-Regular',
  },
});
