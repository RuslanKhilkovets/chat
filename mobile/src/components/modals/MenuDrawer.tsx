import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Drawer, MenuItem} from '@/components';
import {IModalProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '@/context/Auth/AuthContext';
import {useTypedSelector} from '@/hooks';

interface MenuDrawerProps extends IModalProps {}

const MenuDrawer = ({onClose, visible}: MenuDrawerProps) => {
  const {navigate} = useNavigation();
  const {logout} = React.useContext(AuthContext);
  const user = useTypedSelector(state => state.user);

  const onRedirectHandle = (screen: string) => {
    onClose();
    navigate(screen);
  };

  return (
    <Drawer visible={visible} onClose={onClose} openFrom="left">
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onRedirectHandle('Profile')}
            style={{
              height: 70,
              width: 70,
              marginVertical: 20,
              borderRadius: 35,
              backgroundColor: 'yellow',
            }}
          />

          <Text style={styles.userName}>{user?.name}</Text>
          <View style={{marginTop: 20}}>
            <MenuItem
              iconName="person"
              onPress={() => onRedirectHandle('Profile')}>
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
