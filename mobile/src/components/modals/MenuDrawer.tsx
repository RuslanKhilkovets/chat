import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Drawer, MenuItem} from '@/components';
import {IModalProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '@/context/Auth/AuthContext';
import {useTypedSelector} from '@/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@/context/Theme/ThemeContext';

interface MenuDrawerProps extends IModalProps {}

const MenuDrawer = ({onClose, visible}: MenuDrawerProps) => {
  const {navigate} = useNavigation();
  const {theme, colorScheme, setColorScheme} = useTheme();
  const {logout} = useAuthContext();
  const user = useTypedSelector(state => state.user);

  const onRedirectHandle = (screen: string, payload?: any) => {
    onClose();
    navigate(screen, payload);
  };

  return (
    <Drawer visible={visible} onClose={onClose} openFrom="left">
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  onRedirectHandle('Profile', {userId: null, isEditable: true})
                }
                style={{
                  height: 70,
                  width: 70,
                  marginVertical: 20,
                  borderRadius: 35,
                  backgroundColor: 'yellow',
                }}
              />

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
          <View style={{marginTop: 20}}>
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

        <MenuItem iconName="logout" onPress={logout} noBorder>
          Log out
        </MenuItem>
      </View>
    </Drawer>
  );
};

export default MenuDrawer;

const styles = StyleSheet.create({
  userName: {
    color: 'yellow',
    fontFamily: 'Jersey20-Regular',
    fontSize: 24,
  },
});
