import * as React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button, ChatItem, Header, Screen} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {useTheme} from '@/context/Theme/ThemeContext';

export const ChatsScreen = () => {
  const {filteredChats, filterQuery, isUserChatsLoading, notifications} =
    useChatContext();
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const sortedChats = React.useCallback(() => {
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
      <Header />
      {filteredChats?.length !== 0 && (
        <FlatList
          data={sortedChats?.() || []}
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
      {filteredChats?.length === 0 && filterQuery && (
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
    fontFamily: 'Jersey20-Regular',
    textAlign: 'center',
  },
});
