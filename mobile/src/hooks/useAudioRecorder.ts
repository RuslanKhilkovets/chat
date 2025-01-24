import {useState, useCallback, useEffect, useRef} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import AudioRecorderPlayer, {
  AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';

import {useChatContext} from '@/context/Chat/ChatContext';
import useTypedSelector from '@/hooks/useTypedSelector';
import useAuthMutation from '@/hooks/useAuthMutation';
import {Api} from '@/api';
import {sendNotification} from '@/helpers';
import {IMessage, IUser} from '@/types';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [isDiscardingRecording, setIsDiscardingRecording] = useState(false);
  const [recipientUser, setRecipientUser] = useState<IUser>();

  const {t} = useTranslation();
  const {currentChat, recipientId, setMessages, socket} = useChatContext();
  const user = useTypedSelector(state => state.user);

  const audioDurationLocal = useRef(0);

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'ios') return true;
    const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

    if (Platform.OS === 'android' && Platform.Version >= 30) {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        console.log('Permissions not granted');
        return false;
      }

      console.log('All permissions granted');
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const startRecording = useCallback(async () => {
    const permissionsGranted = await checkAndRequestPermissions();
    if (!permissionsGranted) return;

    setIsRecording(true);
    setIsRecordingFinished(false);
    setIsDiscardingRecording(false);

    audioDurationLocal.current = 0;

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.VOICE_RECOGNITION,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    try {
      let uri;
      if (Platform.OS === 'android') {
        const path = RNFS.DocumentDirectoryPath + '/sound.wav';

        uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      } else {
        uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);
      }
      setFile(uri);

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        audioDurationLocal.current = e.currentPosition / 1000;
      });
    } catch (error) {
      console.error('Error starting recorder:', error);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (recipientUser: IUser) => {
    try {
      setRecipientUser(recipientUser);
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsRecordingFinished(true);

      console.log('Final audio duration:', audioDurationLocal.current);
    } catch (error) {
      console.error('Error stopping recorder:', error);
    }
  }, []);

  const discardRecording = useCallback(async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsRecordingFinished(false);
      setIsDiscardingRecording(true);
      setFile(null);
    } catch (error) {
      console.error('Error discarding recording:', error);
    }
  }, []);

  const {mutate: sendAudio, isLoading: isUploading} = useAuthMutation({
    mutationFn: Api.media.sendMessage,
    onSuccess: async (response: {data: {data: IMessage}}) => {
      const newMessage = response.data.data;
      setMessages((prevMessages: IMessage[]) => [newMessage, ...prevMessages]);

      socket?.emit('sendMessage', {
        newMessage,
        recipientId,
      });

      if (recipientUser && recipientUser.playerId) {
        try {
          await sendNotification({
            playerIds: [recipientUser?.playerId],
            title: `${user.name}`,
            message: t('chats.VoiceMessage'),
          });
        } catch (error) {
          console.error('Failed to send push notification:', error);
        }
      }

      setMessages((prevMessages: IMessage[]) => [newMessage, ...prevMessages]);
      setFile(null);
    },
    onError: error => {
      console.error('Error uploading audio:', error.message);
    },
  });

  useEffect(() => {
    if (
      !socket ||
      !file ||
      !isRecordingFinished ||
      (!currentChat && !isDiscardingRecording)
    ) {
      return;
    }

    const sendAudioMessage = async () => {
      try {
        const formData = new FormData();
        formData.append('audio', {
          uri: file,
          type: 'audio/m4a',
          name: 'sound.m4a',
        });

        formData.append('chatId', currentChat?._id);
        formData.append('senderId', user?._id);
        formData.append('duration', audioDurationLocal.current);

        sendAudio(formData);
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    };

    sendAudioMessage();
  }, [
    socket,
    file,
    currentChat,
    isRecordingFinished,
    isDiscardingRecording,
    user?._id,
    sendAudio,
  ]);

  return {
    isRecording,
    isRecordingFinished,
    file,
    isDiscardingRecording,
    isUploading,
    startRecording,
    stopRecording,
    discardRecording,
  };
};

export default useAudioRecorder;
