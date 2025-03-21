import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import i18n from 'i18next';
import 'moment/locale/uk';
import 'moment/locale/uk';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';

import {useTheme} from '@/context/Theme/ThemeContext';
import {useTypedSelector} from '@/hooks';
import {useChatContext} from '@/context/Chat/ChatContext';

interface IMessageItemProps {
  message: any;
  setMessageToEdit: any;
}

const audioPlayer = new AudioRecorderPlayer();

const MessageItem = ({message, setMessageToEdit}: IMessageItemProps) => {
  const currentLanguage = i18n.language;
  const user = useTypedSelector(state => state.user);
  const {deleteMessage} = useChatContext();

  const isMessageMine = message?.senderId === user?._id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const playAudio = async () => {
    if (!message.audioPath) return;

    try {
      if (isPlaying) {
        if (isPaused) {
          // Resume audio playback
          await audioPlayer.resumePlayer();
          setIsPaused(false);
        } else {
          // Pause audio playback
          await audioPlayer.pausePlayer();
          setIsPaused(true);
        }
        return;
      }

      // Start playing from the beginning
      setIsPlaying(true);
      setIsPaused(false);
      await audioPlayer.startPlayer(message.audioPath);

      audioPlayer.addPlayBackListener(e => {
        if (!e) return;

        const progress = (e.currentPosition / e.duration) * 100;
        setCurrentPosition(e.currentPosition / 1000);
        setProgressWidth(progress);

        if (e.currentPosition >= e.duration) {
          audioPlayer.stopPlayer();
          audioPlayer.removePlayBackListener();
          setIsPlaying(false);
          setIsPaused(false);
          setProgressWidth(0);
          setCurrentPosition(0);
        }
      });
    } catch (error) {
      console.error(`${t('errors.AudioPlayingError')}:`, error);
      setIsPlaying(false);
    }
  };

  const [progressWidth, setProgressWidth] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progressWidth]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const onCopyMessageHandle = () => {
    Clipboard.setString(message?.text);
    handleCloseModal();
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isMessageMine ? 'flex-end' : 'flex-start',
          backgroundColor: theme[colorScheme].bgTertiary,
        },
      ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isMessageMine ? 0.7 : 1}>
        {message?.audioPath ? (
          <Pressable onPress={playAudio} style={styles.audioContainer}>
            <Icon
              name={
                isPaused
                  ? 'play-circle-filled'
                  : isPlaying
                  ? 'pause-circle-filled'
                  : 'play-circle-filled'
              }
              size={48}
              color={theme[colorScheme].textPrimary}
            />
            <View
              style={[
                styles.progressBar,
                {backgroundColor: theme[colorScheme].textPrimary},
              ]}>
              <Animated.View
                style={[
                  styles.progress,
                  {width: `${progressWidth}%`},
                  {backgroundColor: theme[colorScheme].bgSecondary},
                ]}
              />
            </View>
          </Pressable>
        ) : (
          <Text
            style={[
              styles.messageText,
              {color: theme[colorScheme].textPrimary},
            ]}>
            {message?.text}
          </Text>
        )}

        {message?.duration ? (
          <Text
            style={[
              styles.audioDuration,
              {color: theme[colorScheme].textPrimary},
            ]}>
            {`${moment.utc(currentPosition * 1000).format('mm:ss')} / ${moment
              .utc(message?.duration * 1000)
              .format('mm:ss')}`}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 10,
            justifyContent: 'flex-end',
          }}>
          <Text style={[styles.date, {color: theme[colorScheme].textPrimary}]}>
            {moment(message?.createdAt).locale(currentLanguage).calendar()}
          </Text>

          {isMessageMine && (
            <View style={styles.statusContainer}>
              {message?.isRead ? (
                <Icon
                  name="done-all"
                  size={16}
                  color={theme[colorScheme].textPrimary}
                />
              ) : (
                <Icon
                  name="done"
                  size={16}
                  color={theme[colorScheme].textPrimary}
                />
              )}
            </View>
          )}
        </View>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={handleCloseModal}>
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View
              style={[
                styles.modalBackground,
                {backgroundColor: theme[colorScheme].shadow},
              ]}>
              <View
                style={[
                  styles.modalContainer,
                  {backgroundColor: theme[colorScheme].bgPrimary},
                ]}>
                {!message?.audioPath && (
                  <>
                    <Pressable
                      style={styles.modalOption}
                      android_ripple={{
                        color: theme[colorScheme].bgSecondary,
                        borderless: false,
                      }}
                      onPress={onCopyMessageHandle}>
                      <Text
                        style={[
                          styles.modalText,
                          {color: theme[colorScheme].textPrimary},
                        ]}>
                        {t('actions.Copy')}
                      </Text>
                    </Pressable>
                    {isMessageMine && (
                      <Pressable
                        onPress={() => {
                          handleCloseModal();
                          setMessageToEdit(message);
                        }}
                        style={styles.modalOption}
                        android_ripple={{
                          color: theme[colorScheme].bgSecondary,
                          borderless: false,
                        }}>
                        <Text
                          style={[
                            styles.modalText,
                            {color: theme[colorScheme].textPrimary},
                          ]}>
                          {t('actions.Edit')}
                        </Text>
                      </Pressable>
                    )}
                  </>
                )}
                {isMessageMine && (
                  <Pressable
                    onPress={() => {
                      handleCloseModal();
                      deleteMessage(message?._id);
                    }}
                    style={styles.modalOption}
                    android_ripple={{
                      color: theme[colorScheme].bgSecondary,
                      borderless: false,
                    }}>
                    <Text
                      style={[
                        styles.modalText,
                        {color: theme[colorScheme].textPrimary},
                      ]}>
                      {t('actions.Delete')}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 10,
  },
  progress: {
    height: '100%',
  },
  container: {
    maxWidth: '80%',
    margin: 10,
    marginBottom: 0,
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: 'yellow',
    fontFamily: 'Jersey-Regular',
    fontSize: 20,
  },
  equalizerBar: {
    width: 5,
    backgroundColor: 'yellow',
    borderRadius: 2,
  },
  audioDuration: {
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 10,
    width: 200,
  },
  modalOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 20,
  },
});
