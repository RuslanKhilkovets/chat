import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Header, Screen} from '@/components';

export const ChatsScreen = () => {
  return (
    <Screen headerShown={false}>
      <Header />
      <Text style={styles.text}>Chats</Text>
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
