import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IProfileItemProps {
  title: string;
  value: string;
  onPress: () => void;
  iconName: string;
}

const ProfileItem = ({iconName, title, value, onPress}: IProfileItemProps) => {
  const {theme, colorScheme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: theme[colorScheme].bgTertiary},
      ]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View>
        <Icon
          color={theme[colorScheme].textPrimary}
          name={iconName}
          size={24}
        />
      </View>
      <View>
        <Text style={[styles.title, {color: theme[colorScheme].textPrimary}]}>
          {value || 'N/A'}
        </Text>
        <Text
          style={[styles.description, {color: theme[colorScheme].textPrimary}]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontFamily: 'Jersey-Regular',
    color: 'yellow',
    fontSize: 22,
  },
  description: {
    fontFamily: 'Jersey-Regular',
    color: '#eaff00a2',
    fontSize: 21,
  },
});
