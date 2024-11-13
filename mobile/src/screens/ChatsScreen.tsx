import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {ChatItem, Header, Screen} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';

export const ChatsScreen = () => {
  const {userChats} = useChatContext();

  return (
    <Screen headerShown={false}>
      <Header />
      <FlatList
        data={userChats || []}
        renderItem={({item}) => <ChatItem chat={item} />}
        keyExtractor={item => item.id}
      />
    </Screen>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    textAlign: 'center',
  },
  screenLabel: {
    fontSize: 50,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    marginVertical: 70,
  },
});
