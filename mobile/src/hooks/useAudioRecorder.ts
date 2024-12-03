import {useState, useCallback, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
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

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [isDiscardingRecording, setIsDiscardingRecording] = useState(false);

  const {currentChat, recipientId, setMessages, socket} = useChatContext();
  const user = useTypedSelector(state => state.user);

  let audioDurationLocal = 0;

  const startRecording = useCallback(async () => {
    setIsRecording(true);
    setIsRecordingFinished(false);
    setIsDiscardingRecording(false);

    audioDurationLocal = 0;

    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.READ_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.RECORD_AUDIO'] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('All required permissions not granted');
          setIsRecording(false);
          return;
        }
      } catch (err) {
        console.warn(err);
        setIsRecording(false);
        return;
      }
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    try {
      const uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);
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
        formData.append('duration', audioDurationLocal.toFixed(2));

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
