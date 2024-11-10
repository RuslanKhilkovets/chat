import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AppIcon} from '@/components';
import {useGoBack} from '@/hooks';

interface IGoBackProps {
  color?: string;
}

export default function GoBack({color = '#E1FF00'}: IGoBackProps) {
  const navigation = useNavigation();
  const goBack = useGoBack();

  return (
    navigation.canGoBack() && (
      <TouchableOpacity onPress={goBack} style={styles.touchableArea}>
        <AppIcon name="back" size={28} color={color} />
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  touchableArea: {
    padding: 10, // Increase the padding to enlarge the touch area
    alignItems: 'flex-start', // Center the icon within the touchable area
    justifyContent: 'flex-start',
  },
});
