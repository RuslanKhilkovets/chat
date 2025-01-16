import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import LogoImage from '@images/m_logo.png';

export const Logo = ({isAnimated = false}) => {
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
        ]),
      ).start();
    };

    animateLogo();
  }, [scale]);

  return isAnimated ? (
    <Animated.Image
      source={LogoImage}
      style={[styles.logo, {transform: [{scale}]}]}
    />
  ) : (
    <Text style={[{color: 'yellow'}, styles.textLogo]}>M</Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  textLogo: {
    fontSize: 240,
    fontWeight: 'bold',
    fontFamily: 'Jersey20-Regular',
  },
});

export default Logo;
