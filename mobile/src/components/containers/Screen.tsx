import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';

import {ScreenHeader} from '@/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IScreen extends React.PropsWithChildren {
  title?: string;
  headerShown?: boolean;
  backColor?: string;
  chatMode?: boolean;
  payload?: any;
}

const Screen = ({
  children,
  title,
  headerShown = true,
  backColor = '#000000',
  chatMode,
  payload,
}: IScreen) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backColor,
          paddingTop: insets.top - 10,
          paddingBottom: insets.bottom,
        },
      ]}>
      {headerShown && (
        <ScreenHeader chatMode={chatMode} payload={payload} title={title} />
      )}
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
});
