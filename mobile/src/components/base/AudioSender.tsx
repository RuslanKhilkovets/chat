import {TouchableOpacity} from 'react-native';
import {useChatContext} from '@/context/Chat/ChatContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioMessageSender = ({chatId}) => {
  const {isRecording, stopRecording, startRecording} = useChatContext();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isRecording ? stopRecording : startRecording}
      style={{
        backgroundColor: isRecording ? '#FF4081' : '#FFD700',
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
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
      <Icon
        size={32}
        name="keyboard-voice"
        color={isRecording ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );
};

export default AudioMessageSender;
