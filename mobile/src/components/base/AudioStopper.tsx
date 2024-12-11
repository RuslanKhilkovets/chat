import {useTheme} from '@/context/Theme/ThemeContext';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SendAudioButton = ({discardRecording}) => {
  const {theme, colorScheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={discardRecording}
      style={{
        height: 50,
        width: 50,
        backgroundColor: theme[colorScheme].error,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
      <Icon size={30} name={'stop'} color={'black'} />
    </TouchableOpacity>
  );
};

export default SendAudioButton;
