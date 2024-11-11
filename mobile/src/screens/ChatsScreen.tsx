import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';

import {Input, Screen} from '@/components';
import {Button} from '@/components';
import {useAuthMutation} from '@/hooks';
import {AuthContext} from '@/context/Auth/AuthContext';
import loginSchema from '@/validations/login';
import {Api} from '@/api';

export const ChatsScreen = () => {
  return (
    <Screen>
      <Text>Chats</Text>
    </Screen>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    textAlign: 'center',
  },
  screenLabel: {
    fontSize: 50,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    marginVertical: 70,
  },
});
