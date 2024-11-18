import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ISettingsItemProps {
  title: string;
  onPress: () => void;
  iconName: string;
}

const SettingsItem = ({iconName, title, onPress}: ISettingsItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <Icon name={iconName} color="yellow" size={24} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SettingsItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1d1d',
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
