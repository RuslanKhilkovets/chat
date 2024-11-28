import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTypedSelector} from '@/hooks';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface IMessageItemProps {
  message: any;
}

const audioPlayer = new AudioRecorderPlayer();

const MessageItem = ({message}: IMessageItemProps) => {
  const user = useTypedSelector(state => state.user);

  const isMessageMine = message?.senderId === user?._id;
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (!message.audioPath) return;

    try {
      if (isPlaying) {
        console.log('Stopping audio...');
        await audioPlayer.stopPlayer();
        setIsPlaying(false);
        return;
      }

      console.log('Playing audio from:', message.audioPath);
      setIsPlaying(true);
      await audioPlayer.startPlayer(message.audioPath);

      audioPlayer.addPlayBackListener(e => {
        console.log('Playback status:', e);

        if (e.currentPosition === e.duration) {
          audioPlayer.stopPlayer();
          audioPlayer.removePlayBackListener();
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isMessageMine ? 'flex-end' : 'flex-start',
        },
      ]}>
      {message?.audioPath ? (
        <TouchableOpacity onPress={playAudio} style={styles.audioContainer}>
          <Icon
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
            size={30}
            color="yellow"
          />
          <Text style={styles.audioText}>Audio Message</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.messageText}>{message?.text}</Text>
      )}

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
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioText: {
    color: 'yellow',
    fontSize: 16,
    marginLeft: 10,
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
