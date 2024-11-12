import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

interface IChatItemProps {}

const ChatItem = ({chat}: IChatItemProps) => {
  const {navigate} = useNavigation();
  const navigateToChat = (id: string) => {};

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.chatItem}
      onPress={() => navigateToChat('dumb')}>
      <View style={styles.profilePic}></View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>Nigga</Text>
        <Text style={styles.lastMsg}>Hello</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  chatItem: {
    padding: 10,
    gap: 15,
    backgroundColor: '#9e9e9e',
    paddingLeft: 20,
    borderBottomColor: 'yellow',
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
  chatInfo: {gap: 10},
  userName: {
    fontSize: 20,
  },
  lastMsg: {},
});
