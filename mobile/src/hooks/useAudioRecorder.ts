import {useState, useCallback, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import AudioRecorderPlayer, {
  AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {useChatContext} from '@/context/Chat/ChatContext';
import useTypedSelector from '@/hooks/useTypedSelector';
import useAuthMutation from '@/hooks/useAuthMutation';
import {Api} from '@/api';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [isDiscardingRecording, setIsDiscardingRecording] = useState(false);

  const {currentChat, recipientId, setMessages, socket} = useChatContext();
  const user = useTypedSelector(state => state.user);

  let audioDurationLocal = 0;

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

    audioDurationLocal = 0;

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    try {
      let uri;
      if (Platform.OS === 'android') {
        const path = RNFS.DocumentDirectoryPath + '/sound.m4a';
        uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      } else {
        uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);
      }
      setFile(uri);

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        audioDurationLocal = e.currentPosition / 1000;
      });
    } catch (error) {
      console.error('Error starting recorder:', error);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsRecordingFinished(true);

      console.log('Final audio duration:', audioDurationLocal);
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
    onSuccess: response => {
      socket.emit('sendMessage', {
        ...response.data.data,
        recipientId,
      });

      setMessages((prevMessages: any[]) => [
        ...prevMessages,
        response.data.data,
      ]);
      setFile(null);
    },
    onError: error => {
      console.error('Error uploading audio:', error);
    },
  });

  useEffect(() => {
    if (
      !socket ||
      !file ||
      !isRecordingFinished ||
      (!currentChat && !isDiscardingRecording)
    )
      return;

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
        formData.append('duration', audioDurationLocal);

        sendAudio(formData);
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    };

    sendAudioMessage();
  }, [socket, file, currentChat, isRecordingFinished]);

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
