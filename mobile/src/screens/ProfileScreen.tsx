import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {ProfileItem, Screen, SettingsItem} from '@/components';
import {useTypedSelector} from '@/hooks';
import {ChangeDataType} from '@/constants';

const ProfileScreen = () => {
  const user = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  return (
    <Screen title="Profile">
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profilePic} />
          <View style={styles.profileDescription}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.online}>Online</Text>
          </View>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockText}>Account</Text>
          <ProfileItem
            iconName="blur-on"
            value={user.tag && `@${user.tag}`}
            title="User tag"
            onPress={() =>
              navigate('ChangePersonalData', {type: ChangeDataType.TAG})
            }
          />
          <ProfileItem
            iconName="alternate-email"
            value={user.email}
            title="Email"
            onPress={() =>
              navigate('ChangePersonalData', {type: ChangeDataType.EMAIL})
            }
          />
          <ProfileItem
            iconName="phone"
            value={user.phone}
            title="Phone"
            onPress={() =>
              navigate('ChangePersonalData', {type: ChangeDataType.PHONE})
            }
          />
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockText}>Settings</Text>
          <SettingsItem
            iconName="language"
            title="Language"
            onPress={() => navigate('Language')}
          />
          <SettingsItem
            iconName="light-mode"
            title="Theme"
            onPress={() => navigate('Theme')}
          />
          <SettingsItem
            iconName="notifications"
            title="Notifications"
            onPress={() => navigate('Notifications')}
          />
          <SettingsItem
            iconName="security"
            title="Security"
            onPress={() => navigate('Security')}
          />
        </View>
        <Text style={styles.appVersion}>MChat v1.0</Text>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'yellow',
    margin: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  profileDescription: {
    justifyContent: 'center',
    gap: 5,
  },
  username: {
    fontSize: 30,
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
  },
  online: {
    fontSize: 16,
    color: 'grey',
    fontFamily: 'Jersey20-Regular',
  },
  infoBlock: {
    marginTop: 20,
    gap: 10,
  },
  infoBlockText: {
    fontSize: 23,
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
  },
  appVersion: {
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
});
