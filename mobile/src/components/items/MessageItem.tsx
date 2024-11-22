import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTypedSelector} from '@/hooks';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IMessageItemProps {
  message: any;
}

const MessageItem = ({message}: IMessageItemProps) => {
  const user = useTypedSelector(state => state.user);

  const isMessageMine = message?.senderId === user?._id;

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isMessageMine ? 'flex-end' : 'flex-start',
        },
      ]}>
      <Text style={styles.messageText}>{message?.text}</Text>

      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
        <Text style={styles.date}>{moment(message?.createdAt).calendar()}</Text>

        {isMessageMine && (
          <View style={styles.statusContainer}>
            {message?.isRead ? (
              <Icon name="done-all" size={16} color="yellow" />
            ) : (
              <Icon name="done" size={16} color="yellow" />
            )}
          </View>
        )}
      </View>
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
  date: {
    color: 'yellow',
    textAlign: 'right',
    fontSize: 12,
    marginTop: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
