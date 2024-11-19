import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';

import {GoBack} from '@/components';
import {useNavigation} from '@react-navigation/native';

interface IScreenHeaderProps {
  chatMode?: boolean;
  payload?: any;
  title?: string;
}

const ScreenHeader = ({title, payload}: IScreenHeaderProps) => {
  const {navigate} = useNavigation();

  return (
    <View
      style={[
        styles.header,
        {justifyContent: !!title ? 'center' : 'flex-start'},
      ]}>
      <View
        style={[
          styles.icon,
          {top: !title ? 5 : Platform.OS === 'android' ? 3 : 0},
        ]}>
        <GoBack />
      </View>

      {title && <Text style={[styles.headerTitle]}>{title}</Text>}
      {payload && (
        <Pressable
          style={styles.userInfo}
          onPress={() => navigate('Profile', {userId: payload.userId})}>
          <View style={styles.profilePic} />
          <View>
            <Text style={styles.name}>{payload.name}</Text>
            <Text style={styles.isOnline}>
              {payload.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'relative',
    paddingVertical: 10,
    alignItems: 'center',
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'yellow',
  },
  userInfo: {
    marginLeft: 70,
    flexDirection: 'row',
    gap: 15,
  },
  headerTitle: {
    color: 'yellow',
    fontSize: 26,
    fontFamily: 'Jersey20-Regular',
    textTransform: 'capitalize',
  },
  name: {
    color: 'yellow',
    fontSize: 22,
    fontFamily: 'Jersey20-Regular',
  },
  isOnline: {
    color: 'yellow',
    fontSize: 16,
    fontFamily: 'Jersey20-Regular',
  },
  icon: {
    position: 'absolute',
    left: 0,
  },
});

export default ScreenHeader;
