import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AppIcon} from '@/components';
import {useGoBack} from '@/hooks';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IGoBackProps {
  color?: string;
}

export default function GoBack({color}: IGoBackProps) {
  const navigation = useNavigation();
  const goBack = useGoBack();
  const {theme, colorScheme} = useTheme();

  return (
    navigation.canGoBack() && (
      <TouchableOpacity onPress={goBack} style={styles.touchableArea}>
        <AppIcon
          name="back"
          size={28}
          color={color || theme[colorScheme].textPrimary}
        />
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  touchableArea: {
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
