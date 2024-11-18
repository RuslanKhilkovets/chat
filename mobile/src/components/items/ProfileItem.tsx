import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IProfileItemProps {
  title: string;
  value: string;
  onPress: () => void;
  iconName: string;
}

const ProfileItem = ({iconName, title, value, onPress}: IProfileItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View>
        <Icon color="yellow" name={iconName} size={24} />
      </View>
      <View>
        <Text style={styles.title}>{value || 'N / A'}</Text>
        <Text style={styles.description}>{title}</Text>
      </View>
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
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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
