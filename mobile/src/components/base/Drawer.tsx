import {
  Animated,
  Dimensions,
  StyleSheet,
  Modal as NativeModal,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IModalProps} from '@/types';

const Drawer = ({visible, onClose, openFrom, children}: IModalProps) => {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const [isVisible, setIsVisible] = useState(visible);

  const insets = useSafeAreaInsets();

  const initialTranslate = {
    left: -screenWidth,
    right: screenWidth,
    top: -screenHeight,
    bottom: screenHeight,
  }[openFrom];

  const slideAnim = useRef(new Animated.Value(initialTranslate)).current;

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: initialTranslate,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        onClose();
      });
    }
  }, [visible]);

  const transformStyle = {
    transform: [
      openFrom === 'left' || openFrom === 'right'
        ? {translateX: slideAnim}
        : {translateY: slideAnim},
    ],
  };

  return (
    <NativeModal
      statusBarTranslucent
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <Pressable
        style={[
          styles.modalOverlay,
          {
            alignItems: openFrom === 'left' ? 'flex-start' : 'flex-end',
          },
        ]}
        onPress={onClose}>
        <Pressable onPress={() => {}} style={{flex: 1}}>
          <Animated.View
            style={[
              styles.modalContainer,
              transformStyle,
              {
                paddingTop: insets.top + 10,
                paddingBottom: insets.bottom + 10,
                paddingHorizontal: 20,
              },
            ]}>
            {children}
          </Animated.View>
        </Pressable>
      </Pressable>
    </NativeModal>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    width: 300,
    height: '100%',
    backgroundColor: '#272727',
    color: '#E1FF00',
  },
});
