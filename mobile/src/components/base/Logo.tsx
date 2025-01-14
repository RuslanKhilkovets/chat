import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LogoImage from '@images/m_logo.png';

export const Logo = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateLogo = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateLogo();
  }, [scale]);

  return (
    <Animated.Image
      source={LogoImage}
      style={[styles.logo, { transform: [{ scale }] }]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
});

export default Logo;
