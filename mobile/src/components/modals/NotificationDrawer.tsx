import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  return (
    <Drawer visible={visible} onClose={onClose} openFrom="right">
      {/* {unread?.length === 0 ? null : <Text>{unread?.length}</Text>} */}

      <Text style={styles.title}>Notifications</Text>

      {modifiedNotifications?.length !== 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.markAllAsRead}
          onPress={() => markAllAsRead(notifications)}>
          <Text>Mark all as read</Text>
        </TouchableOpacity>
      )}

      {modifiedNotifications?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noNotificationsText}>No notification yet...</Text>
        </View>
      ) : null}

      {modifiedNotifications && (
        <FlatList
          data={modifiedNotifications}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  markAsRead(item, userChats, user, notifications);
                }}
                style={styles.notification}>
                <Text>{`${item.senderName} sent you a message`}</Text>
                <Text style={styles.date}>{`${moment(
                  item.date,
                ).calendar()}`}</Text>
              </TouchableOpacity>
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
  markAllAsRead: {
    alignSelf: 'flex-end',
    padding: 20,
    paddingVertical: 10,
    marginVertical: 10,
    backgroundColor: 'yellow',
    color: '#fff',
    borderRadius: 10,
  },
  noNotificationsText: {
    fontSize: 24,
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
  },
  notification: {
    width: '100%',
    padding: 20,
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: 'yellow',
    color: '#fff',
    borderRadius: 10,
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
});
