import {StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';

import {CheckPasswordForm, Screen} from '@/components';

const ChangePersonalDataScreen = () => {
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const route = useRoute();
  const {type} = route.params || {};

  return (
    <Screen title={type}>
      {!isPasswordChecked && (
        <CheckPasswordForm setIsPasswordChecked={setIsPasswordChecked} />
      )}
    </Screen>
  );
};

export default ChangePersonalDataScreen;

const styles = StyleSheet.create({});
