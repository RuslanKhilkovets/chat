import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {useChatContext} from '@/context/Chat/ChatContext';
import {useTypedSelector} from '@/hooks';
import {getAvatarColor} from '@/helpers';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IUser {
  _id: string;
  name: string;
  tag?: string;
}

interface IUserItemProps {
  user: IUser;
}

const UserItem = ({user}: IUserItemProps) => {
  const {createChat} = useChatContext();
  const currentUser = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();
  const {theme, colorScheme} = useTheme();

  const redirectToChat = async () => {
    try {
      const newChat = await createChat(user._id, currentUser._id);
      navigate('Chat', {chat: newChat});
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={redirectToChat}
      activeOpacity={0.7}>
      <View style={[styles.pic, {backgroundColor: getAvatarColor(user._id)}]}>
        <Text style={[styles.picText, {color: theme[colorScheme].textPrimary}]}>
          {user?.name[0]?.toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.text, {color: theme[colorScheme].textPrimary}]}>
          {user?.name}
        </Text>
        {user.tag && (
          <Text
            style={[
              styles.text,
              {fontSize: 16},
              {color: theme[colorScheme].textPrimary},
            ]}>
            @{user.tag}
          </Text>
        )}
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
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
  },
  info: {
    marginVertical: 5,
    gap: 10,
  },
  pic: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
