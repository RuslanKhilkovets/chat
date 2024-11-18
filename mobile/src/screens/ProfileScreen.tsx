import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ProfileItem, Screen, SettingsItem} from '@/components';
import {useTypedSelector} from '@/hooks';

const ProfileScreen = () => {
  const user = useTypedSelector(state => state.user);

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
          <ProfileItem value={user.tag} title="User tag" />
          <ProfileItem value={user.email} title="Email" />
          <ProfileItem value={user.phone} title="Phone" />
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockText}>Settings</Text>
          <SettingsItem title="Language" onPress={() => {}} />
          <SettingsItem title="Theme" onPress={() => {}} />
          <SettingsItem title="Notifications" onPress={() => {}} />
        </View>
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
    gap: 10,
  },
  infoBlockText: {
    fontSize: 23,
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
  },
});
