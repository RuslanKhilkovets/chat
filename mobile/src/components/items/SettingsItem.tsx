import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface ISettingsItemProps {
  title: string;
  onPress: () => void;
}

const SettingsItem = ({title, onPress}: ISettingsItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
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
  },
  title: {
    fontFamily: 'Jersey20-Regular',
    color: 'yellow',
    fontSize: 22,
  },
});
