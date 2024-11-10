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
    width: 250,
    textAlign: 'center',
    color: '#000',
    fontSize: 22,
    fontFamily: 'Raleway-SemiBold',
  },

  icon: {
    position: 'absolute',
    left: 0,
  },
});

export default ScreenHeader;
