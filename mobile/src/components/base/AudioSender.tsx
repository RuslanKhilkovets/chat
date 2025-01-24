import React from 'react';
import {useTheme} from '@/context/Theme/ThemeContext';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IAudioStopperProps {
  isRecording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
}

const AudioStopper = ({
  isRecording,
  stopRecording,
  startRecording,
}: IAudioStopperProps) => {
  const {theme, colorScheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isRecording ? stopRecording : startRecording}
      style={{
        backgroundColor: theme[colorScheme].bgTertiary,
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
      <Icon
        size={32}
        name={isRecording ? 'send' : 'keyboard-voice'}
        color={theme[colorScheme].textPrimary}
      />
    </TouchableOpacity>
  );
};

export default AudioStopper;
