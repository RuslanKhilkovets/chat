import {useTheme} from '@/context/Theme/ThemeContext';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';

type TButtonType = 'primary' | 'secondary' | 'bordered' | 'light';

interface IButtonProps extends React.PropsWithChildren {
  type?: TButtonType;
  onPress: (...params: any) => void;
  style?: ViewStyle;
  before?: React.JSX.Element | null;
  after?: React.JSX.Element | null;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  type = 'primary',
  onPress,
  style,
  fullWidth,
  after = null,
  before = null,
  isLoading,
}: IButtonProps) => {
  const {theme, colorScheme} = useTheme();
  const textColor =
    type === 'primary'
      ? theme[colorScheme].textPrimary
      : theme[colorScheme].textPrimary;

  return (
    <TouchableOpacity
      style={[styles.button, styles[type], style, fullWidth && {width: '100%'}]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isLoading}>
      {!!isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        before
      )}

      <Text
        style={[
          styles.buttonText,
          {
            color: textColor,
            textDecorationLine: type === 'secondary' ? 'underline' : 'none',
          },
        ]}>
        {children}
      </Text>

      {after}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    marginVertical: 10,
  },
  primary: {
    backgroundColor: '#1E1E1E',
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  secondary: {
    backgroundColor: 'transparent',
    fontSize: 20,
  },
  light: {
    backgroundColor: '#F8F6F6',
  },
  buttonText: {
    fontSize: 22,
    color: '#E1FF00',
    fontFamily: 'Jersey20-Regular',
  },
});

export default Button;
