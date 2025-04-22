import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';

import {Drawer, MenuItem, SmallModal} from '@/components';
import {IModalProps} from '@/types';
import {useAuthContext} from '@/context/Auth/AuthContext';
import {useTypedSelector} from '@/hooks';
import {useTheme} from '@/context/Theme/ThemeContext';
import {getAvatarColor} from '@/helpers';
import {useChatContext} from '@/context/Chat/ChatContext';
import {resetUser} from '@/store/user';

interface MenuDrawerProps extends IModalProps {}

const MenuDrawer = ({onClose, visible}: MenuDrawerProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {navigate} = useNavigation();
  const {theme, colorScheme, setColorScheme} = useTheme();
  const {logout} = useAuthContext();
  const {setUserChats, setFilteredChats} = useChatContext();
  const user = useTypedSelector(state => state.user);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onRedirectHandle = (screen: string, payload?: any) => {
    onClose();
    navigate(screen, payload);
  };

  const handleLogout = () => {
    logout();
    setUserChats([]);
    setFilteredChats([]);
    dispatch(resetUser());
    onClose();
    setIsModalVisible(false);
  };

  return (
    <Drawer visible={visible} onClose={onClose} openFrom="left">
      <View style={styles.drawerContainer}>
        <View>
          <View style={styles.header}>
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  onRedirectHandle('Profile', {userId: null, isEditable: true})
                }
                style={[
                  styles.avatar,
                  {backgroundColor: getAvatarColor(user?._id)},
                ]}>
                <Text
                  style={[
                    styles.picText,
                    {color: theme[colorScheme].textPrimary},
                  ]}>
                  {user?.name[0]?.toUpperCase()}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.userName,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {user?.name}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
              }>
              <Icon
                name={colorScheme === 'light' ? 'bedtime' : 'brightness-high'}
                color={theme[colorScheme].textPrimary}
                size={32}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemsContainer}>
            <MenuItem
              iconName="person"
              onPress={() =>
                onRedirectHandle('Profile', {
                  userId: null,
                  isEditable: true,
                })
              }>
              {t('menu.Profile')}
            </MenuItem>

            <MenuItem
              iconName="search"
              onPress={() => onRedirectHandle('FindUsers')}>
              {t('menu.FindUsers')}
            </MenuItem>
            <MenuItem
              iconName="settings"
              onPress={() => onRedirectHandle('Settings')}>
              {t('menu.Settings')}
            </MenuItem>
            <MenuItem
              iconName="shield"
              onPress={() => onRedirectHandle('PrivacyPolicies')}>
              {t('menu.PrivacyPolicies')}
            </MenuItem>
            <MenuItem iconName="info" onPress={() => onRedirectHandle('About')}>
              {t('menu.AboutApp')}
            </MenuItem>
          </View>
        </View>

        <MenuItem
          iconName="logout"
          onPress={() => setIsModalVisible(true)}
          noBorder>
          {t('actions.LogOut')}
        </MenuItem>
      </View>
      <SmallModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
        text={t('actions.LogOutAgreementTitle')}
        confirmText={t('actions.LogOut')}
        cancelText={t('actions.Cancel')}
      />
    </Drawer>
  );
};

export default MenuDrawer;

const styles = StyleSheet.create({
  picText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  drawerContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    width: 70,
    marginVertical: 20,
    borderRadius: 35,
  },
  userName: {
    fontFamily: 'Jersey-Regular',
    fontSize: 24,
  },
  menuItemsContainer: {
    marginTop: 20,
  },
});
