import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IMenuItemProps extends React.PropsWithChildren {
  iconName: string;
  onPress: () => void;
  noBorder?: boolean;
}

const MenuItem = ({
  iconName,
  children,
  onPress,
  noBorder = false,
}: IMenuItemProps) => {
  const {theme, colorScheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        {
          borderBottomWidth: noBorder ? 0 : 1,
          borderBottomColor: theme[colorScheme].textPrimary,
        },
      ]}>
      <Icon name={iconName} size={24} color={theme[colorScheme].textPrimary} />
      <Text style={[styles.text, {color: theme[colorScheme].textPrimary}]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingLeft: 0,
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Jersey20-Regular',
    fontSize: 20,
  },
});
