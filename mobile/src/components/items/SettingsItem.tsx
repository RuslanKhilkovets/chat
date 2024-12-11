import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/context/Theme/ThemeContext';

interface ISettingsItemProps {
  title: string;
  onPress: () => void;
  iconName: string;
}

const SettingsItem = ({iconName, title, onPress}: ISettingsItemProps) => {
  const {theme, colorScheme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: theme[colorScheme].bgTertiary},
      ]}
      activeOpacity={0.7}
      onPress={onPress}>
      <Icon name={iconName} color={theme[colorScheme].textPrimary} size={24} />
      <Text style={[styles.title, {color: theme[colorScheme].textPrimary}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SettingsItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: 'Jersey20-Regular',
    color: 'yellow',
    fontSize: 22,
  },
});
