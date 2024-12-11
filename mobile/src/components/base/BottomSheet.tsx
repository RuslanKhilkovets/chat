import {useTheme} from '@/context/Theme/ThemeContext';
import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const {height} = Dimensions.get('window');

const BottomSheet = ({visible, onClose, children}: any) => {
  const {theme, colorScheme} = useTheme();
  const translateY = useRef(new Animated.Value(height)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeSheet();
        } else {
          openSheet();
        }
      },
    }),
  ).current;

  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  React.useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View
            style={[
              styles.overlay,
              {backgroundColor: theme[colorScheme].shadow},
            ]}
          />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          styles.container,
          {transform: [{translateY}]},
          {backgroundColor: theme[colorScheme].bgSecondary},
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.dragIndicator} />
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#606060',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default BottomSheet;
