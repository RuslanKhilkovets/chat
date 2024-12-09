import * as React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Button, ChatItem, Header, Screen} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {useNavigation} from '@react-navigation/native';

export const ChatsScreen = () => {
  const {filteredChats, filterQuery, isUserChatsLoading, notifications} =
    useChatContext();
  const {navigate} = useNavigation();

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
          <Text style={styles.noChatsText}>There is no chats yet!</Text>
          <Text style={[styles.noChatsText, {fontSize: 20}]}>
            You can find person for chating now ;)
          </Text>
          <Button onPress={onFindMateRedirectHandle}>Find mate</Button>
        </View>
      )}
      {filteredChats?.length === 0 && filterQuery && (
        <View style={styles.container}>
          <Text style={[styles.noChatsText, {fontSize: 20}]}>
            Did not find any chats with given users!
          </Text>
          <Button onPress={onFindMateRedirectHandle}>Find mate</Button>
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
    color: '#E1FF00',
    textAlign: 'center',
  },
});
