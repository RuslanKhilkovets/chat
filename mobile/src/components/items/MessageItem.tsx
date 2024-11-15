import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTypedSelector} from '@/hooks';
import moment from 'moment';

interface IMessageItemProps {
  message: any;
}

const MessageItem = ({message}: IMessageItemProps) => {
  const user = useTypedSelector(state => state.user);

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf:
            message?.senderId === user?._id ? 'flex-end' : 'flex-start',
        },
      ]}>
      <Text style={styles.messageText}>{message?.text}</Text>
      <Text style={styles.date}>{moment(message?.createdAt).calendar()}</Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    backgroundColor: '#333',
    margin: 20,
    marginBottom: 0,
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
    fontSize: 20,
  },
  date: {color: 'yellow', textAlign: 'right', fontSize: 12, marginTop: 15},
});
