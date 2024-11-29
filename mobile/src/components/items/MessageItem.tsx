import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
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
  const [currentPosition, setCurrentPosition] = useState(0);
  const [equalizerHeights, setEqualizerHeights] = useState<number[]>([
    1, 2, 15, 10, 5, 7, 1, 7, 8, 8, 0, 10, 2, 5, 15, 12,
  ]);

  const playAudio = async () => {
    if (!message.audioPath) return;

    try {
      if (isPlaying) {
        await audioPlayer.stopPlayer();
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      await audioPlayer.startPlayer(message.audioPath);

      audioPlayer.addPlayBackListener(e => {
        setCurrentPosition(e.currentPosition / 1000);

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

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newHeights = Array.from(
          {length: 15},
          () => Math.floor(Math.random() * 30) + 5,
        );
        setEqualizerHeights(newHeights);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

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
          <View style={styles.equalizer}>
            {equalizerHeights.map((height, index) => (
              <Animated.View
                key={index}
                style={[styles.equalizerBar, {height}]}
              />
            ))}
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.messageText}>{message?.text}</Text>
      )}

      {message?.duration ? (
        <Text style={styles.audioDuration}>
          {`${moment.utc(currentPosition * 1000).format('mm:ss')} / ${moment
            .utc(message?.duration * 1000)
            .format('mm:ss')}`}
        </Text>
      ) : null}

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
  equalizer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 3,
  },
  equalizerBar: {
    width: 5,
    backgroundColor: 'yellow',
    borderRadius: 2,
  },
  audioDuration: {
    color: 'yellow',
    fontSize: 14,
    marginTop: 5,
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
