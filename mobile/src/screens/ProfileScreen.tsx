import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {ProfileItem, Screen, SettingsItem} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {ChangeDataType} from '@/constants';
import {Api} from '@/api';
import {useChatContext} from '@/context/Chat/ChatContext';

const ProfileScreen = () => {
  const {onlineUsers} = useChatContext();

  const currentUser = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  const route = useRoute();
  const {userId, isEditable} = route.params || {};

  const isOnline = onlineUsers?.some(user => {
    return user?.userId === userId || isEditable;
  });

  const [user, setUser] = useState(!userId && currentUser);

  const {mutate: getUserDataMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.findById,
    onSuccess: res => {
      setUser(res.data);
    },
  });

  useEffect(() => {
    getUserDataMutation(userId);
  }, []);

  return (
    <Screen title="Profile">
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profilePic} />
          <View style={styles.profileDescription}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.online}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockText}>Account</Text>
          <ProfileItem
            iconName="blur-on"
            value={user.tag && `@${user.tag}`}
            title="User tag"
            onPress={() =>
              isEditable &&
              navigate('ChangePersonalData', {type: ChangeDataType.TAG})
            }
          />
          <ProfileItem
            iconName="alternate-email"
            value={user.email}
            title="Email"
            onPress={() =>
              isEditable &&
              navigate('ChangePersonalData', {type: ChangeDataType.EMAIL})
            }
          />
          <ProfileItem
            iconName="phone"
            value={user.phone}
            title="Phone"
            onPress={() =>
              isEditable &&
              navigate('ChangePersonalData', {type: ChangeDataType.PHONE})
            }
          />
        </View>

        {isEditable && (
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
        )}
        {/* <Text style={styles.appVersion}>MChat v1.0</Text> */}
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
