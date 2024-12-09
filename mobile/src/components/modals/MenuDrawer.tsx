import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Drawer, MenuItem, SmallModal} from '@/components';
import {IModalProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '@/context/Auth/AuthContext';
import {useTypedSelector} from '@/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/context/Theme/ThemeContext';
import {getAvatarColor} from '@/helpers';

interface MenuDrawerProps extends IModalProps {}

const MenuDrawer = ({onClose, visible}: MenuDrawerProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {navigate} = useNavigation();
  const {theme, colorScheme, setColorScheme} = useTheme();
  const {logout} = useAuthContext();
  const user = useTypedSelector(state => state.user);

  const onRedirectHandle = (screen: string, payload?: any) => {
    onClose();
    navigate(screen, payload);
  };

  const handleLogout = () => {
    logout();
    onClose();
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
                <Text style={styles.picText}>
                  {user.name[0]?.toUpperCase()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
              }>
              <Icon
                name={colorScheme === 'light' ? 'bedtime' : 'brightness-high'}
                color={'yellow'}
                size={32}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemsContainer}>
            <MenuItem
              iconName="person"
              onPress={() =>
                onRedirectHandle('Profile', {userId: null, isEditable: true})
              }>
              My profile
            </MenuItem>
            <MenuItem
              iconName="texture"
              onPress={() => onRedirectHandle('Theme')}>
              Theme
            </MenuItem>
            <MenuItem
              iconName="search"
              onPress={() => onRedirectHandle('FindUsers')}>
              Find users
            </MenuItem>
            <MenuItem iconName="save" onPress={() => onRedirectHandle('Saved')}>
              Saved
            </MenuItem>
            <MenuItem
              iconName="shield"
              onPress={() => onRedirectHandle('PrivacyPolicies')}>
              Privacy policies
            </MenuItem>
            <MenuItem iconName="info" onPress={() => onRedirectHandle('About')}>
              About app
            </MenuItem>
          </View>
        </View>

        <MenuItem
          iconName="logout"
          onPress={() => setIsModalVisible(true)}
          noBorder>
          Log out
        </MenuItem>
      </View>
      <SmallModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
        text="Are you sure you want to log out?"
        confirmText="Log out"
        cancelText="Cancel"
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
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
    fontSize: 24,
  },
  menuItemsContainer: {
    marginTop: 20,
  },
});
