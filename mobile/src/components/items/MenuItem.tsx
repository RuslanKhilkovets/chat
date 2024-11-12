import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.button, {borderBottomWidth: noBorder ? 0 : 1}]}>
      <Icon name={iconName} size={24} color={'yellow'} />
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingLeft: 0,
    borderBottomColor: 'yellow',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Jersey20-Regular',
    fontSize: 20,
    color: 'yellow',
  },
});
