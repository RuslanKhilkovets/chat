import {Platform, ScrollView} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const KeyboardScroll = ({children}: React.PropsWithChildren) => {
  return Platform.OS === 'ios' ? (
    <KeyboardAwareScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={50}>
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
};

export default KeyboardScroll;
