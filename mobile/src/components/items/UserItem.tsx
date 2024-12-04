import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {useChatContext} from '@/context/Chat/ChatContext';
import {useTypedSelector} from '@/hooks';

interface IUserItemProps {
  user: any;
}

const UserItem = ({user}: IUserItemProps) => {
  const {createChat} = useChatContext();
  const currentUser = useTypedSelector(state => state.user);

  const {navigate} = useNavigation();

  const redirectToChat = async () => {
    const newChat = await createChat(user._id, currentUser._id);
    navigate('Chat', {chat: newChat});
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={redirectToChat}
      activeOpacity={0.7}>
      <View style={styles.pic}></View>
      <View style={styles.info}>
        <Text style={styles.text}>{user.name}</Text>
        <Text style={[styles.text, {fontSize: 16}]}>{user?.tag}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: 'yellow',
  },
  info: {
    marginVertical: 5,
    gap: 20,
  },
  pic: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#5d5d5d',
  },
});
