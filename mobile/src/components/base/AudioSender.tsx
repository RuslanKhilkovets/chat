import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAudioRecorder} from '@/hooks';

const AudioStopper = () => {
  const {isRecording, stopRecording, startRecording} = useAudioRecorder();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isRecording ? stopRecording : startRecording}
      style={{
        backgroundColor: '#FFD700',
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 4},
        elevation: 6,
        height: 60,
        width: 60,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
      <Icon
        size={32}
        name={isRecording ? 'send' : 'keyboard-voice'}
        color={'black'}
      />
    </TouchableOpacity>
  );
};

export default AudioStopper;
