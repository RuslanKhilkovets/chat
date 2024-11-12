import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {GoBack} from '@/components';

const ScreenHeader = ({children}: React.PropsWithChildren) => {
  return (
    <View style={styles.header}>
      <View style={[styles.icon, {top: Platform.OS === 'android' ? 3 : 0}]}>
        <GoBack />
      </View>

      <Text style={styles.headerTitle}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'yellow',
    fontSize: 26,
    fontFamily: 'Jersey20-Regular',
    marginTop: 10,
  },

  icon: {
    position: 'absolute',
    left: 0,
  },
});

export default ScreenHeader;
