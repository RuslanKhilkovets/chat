import {MenuDrawer, NotificationDrawer} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {unreadNotifications} from '@/helpers/unreadNotifications';
import * as React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Header = () => {
  const {notifications} = useChatContext();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const unread = unreadNotifications(notifications);

  return (
    <View style={[styles.headerContainer]}>
      <TouchableOpacity
        onPress={() => setIsDrawerOpen(true)}
        style={styles.iconButton}>
        <Icon name="menu" size={32} color="black" />
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => setIsNotificationsOpen(true)}
        style={styles.iconButton}>
        <Icon name="notifications" size={32} color="black" />
        {unread?.length !== 0 && (
          <View
            style={{
              position: 'absolute',
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: 'yellow',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        )}
      </TouchableOpacity> */}

      <MenuDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <NotificationDrawer
        visible={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#b4d50e',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconButton: {
    padding: 8,
  },
});

export default Header;
