import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SendAudioButton = ({discardRecording}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={discardRecording}
      style={{
        height: 50,
        width: 50,
        backgroundColor: 'red',
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
      <Icon size={30} name={'stop'} color={'black'} />
    </TouchableOpacity>
  );
};

export default SendAudioButton;
