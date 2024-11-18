import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

interface IProfileItemProps {
  title: string;
  value: string;
  onPress: () => void;
}

const ProfileItem = ({title, value, onPress}: IProfileItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <Text style={styles.title}>{value || 'N / A'}</Text>
      <Text style={styles.description}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ProfileItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1d1d',
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
  },
  title: {
    fontFamily: 'Jersey20-Regular',
    color: 'yellow',
    fontSize: 22,
  },
  description: {
    fontFamily: 'Jersey20-Regular',
    color: '#eaff00a2',
    fontSize: 21,
  },
});
