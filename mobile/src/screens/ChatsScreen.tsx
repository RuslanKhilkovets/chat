import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button, ChatItem, Header, MenuDrawer, Screen} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {useTheme} from '@/context/Theme/ThemeContext';

export const ChatsScreen = () => {
  const {filteredChats, filterQuery, isUserChatsLoading, notifications} =
    useChatContext();
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const pan = React.useRef(new Animated.Value(0)).current;

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger only when the gesture is a horizontal swipe
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          gestureState.dx > 20
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          // Update the animated value during the swipe
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // If swipe distance is sufficient, open the drawer
          openDrawer();
        }
        // Reset the animated value
        Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start();
      },
    }),
  ).current;

  const sortedChats = React.useMemo(() => {
    const uniqueChats = filteredChats?.filter(
      (chat, index, self) => self.findIndex(c => c._id === chat._id) === index,
    );

    return uniqueChats?.sort((a, b) => {
      const aHasUnread = notifications.some(
        notification =>
          a.members.includes(notification.senderId) && !notification.isRead,
      );
      const bHasUnread = notifications.some(
        notification =>
          b.members.includes(notification.senderId) && !notification.isRead,
      );

      if (aHasUnread && !bHasUnread) return -1;
      if (!aHasUnread && bHasUnread) return 1;

      return 0;
    });
  }, [filteredChats, notifications]);

  const onFindMateRedirectHandle = () => {
    navigate('FindUsers');
  };

  return (
    <Screen headerShown={false}>
      <Header openMenu={openDrawer} />
      <MenuDrawer visible={isDrawerOpen} onClose={closeDrawer} />
      <View style={{flex: 1}} {...panResponder.panHandlers}>
        {filteredChats?.length !== 0 && (
          <FlatList
            data={sortedChats || []}
            renderItem={({item}) => <ChatItem chat={item} />}
            keyExtractor={item => item.id}
          />
        )}

        {filteredChats?.length === 0 && !filterQuery && !isUserChatsLoading && (
          <View style={styles.container}>
            <Text
              style={[
                styles.noChatsText,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('warnings.NoChats')}
            </Text>
            <Text
              style={[
                styles.noChatsText,
                {fontSize: 20},
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('warnings.NoChatsAdvice')}
            </Text>
            <Button onPress={onFindMateRedirectHandle}>
              {t('actions.FindMate')}
            </Button>
          </View>
        )}
        {filteredChats?.length === 0 && filterQuery && !isUserChatsLoading && (
          <View style={styles.container}>
            <Text
              style={[
                styles.noChatsText,
                {fontSize: 20},
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('warnings.DidNotFindChats')}
            </Text>
            <Button onPress={onFindMateRedirectHandle}>
              {t('actions.FindMate')}
            </Button>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  noChatsText: {
    fontSize: 24,
    fontFamily: 'Jersey-Regular',
    textAlign: 'center',
  },
});
