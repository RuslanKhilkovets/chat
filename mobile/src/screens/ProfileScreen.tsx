import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {ProfileItem, Screen} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {ChangeDataType} from '@/constants';
import {Api} from '@/api';
import {useChatContext} from '@/context/Chat/ChatContext';
import {getAvatarColor, getInitials} from '@/helpers';
import {useTheme} from '@/context/Theme/ThemeContext';

const ProfileScreen = () => {
  const {onlineUsers} = useChatContext();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const currentUser = useTypedSelector(state => state.user);
  const {navigate} = useNavigation();

  const route = useRoute();
  const {userId, isEditable} = route.params || {};

  const isOnline = onlineUsers?.some(user => {
    return user?.userId === userId || isEditable;
  });

  const [user, setUser] = useState(!userId && currentUser);

  const {mutate: getUserDataMutation} = useAuthMutation({
    mutationFn: Api.users.findById,
    onSuccess: res => {
      setUser(res.data);
    },
  });

  useEffect(() => {
    getUserDataMutation(userId);
  }, []);

  return (
    <Screen title={t('screens.Profile')}>
      <ScrollView
        style={{
          paddingHorizontal: 20,
        }}>
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.profilePic,
              {backgroundColor: getAvatarColor(user?._id)},
            ]}>
            <Text
              style={[
                styles.profileInitials,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {getInitials(user?.name)}
            </Text>
          </View>
          <View style={styles.profileDescription}>
            <Text
              style={[
                styles.username,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {user?.name}
            </Text>
            <Text
              style={[styles.online, {color: theme[colorScheme].textTertiary}]}>
              {isOnline ? t('actions.Online') : t('actions.Offline')}
            </Text>
          </View>
        </View>
        <View style={styles.infoBlock}>
          <Text
            style={[
              styles.infoBlockText,
              {color: theme[colorScheme].textPrimary},
            ]}>
            Account
          </Text>
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
      </ScrollView>
      <Text
        style={[styles.appVersion, {color: theme[colorScheme].textPrimary}]}>
        MChat v1.0
      </Text>
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileInitials: {
    color: 'yellow',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 15,
  },
  profileDescription: {
    justifyContent: 'center',
    gap: 5,
    marginLeft: 10,
  },
  username: {
    fontSize: 30,
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
  },
  online: {
    fontSize: 16,
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
    position: 'absolute',
    width: '100%',
    bottom: 20,
  },
});
