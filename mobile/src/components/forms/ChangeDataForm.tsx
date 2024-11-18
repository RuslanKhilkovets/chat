import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Input} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';
import {useRoute} from '@react-navigation/native';

const ChangeDataForm = () => {
  const {_id: userId} = useTypedSelector(state => state.user);

  const route = useRoute();
  const {type} = route.params || {};

  const [fieldToChange, setFieldToChange] = useState('');
  const [error, setError] = useState('');

  const {mutate: checkPasswordMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.changePersonalData,
    onSuccess: res => {
      console.log(res);
    },
    onError: error => {
      // setError('Incorrect password');
    },
  });

  const changePersonalData = () => {
    const payload = {};

    checkPasswordMutation(payload);
  };

  return (
    <View style={styles.container}>
      <Input
        value={fieldToChange}
        onChangeText={setFieldToChange}
        placeholder={type}
        error={error}
        disabled={isLoading}
      />
      <Button onPress={() => changePersonalData()} isLoading={isLoading}>
        Change {type}
      </Button>
    </View>
  );
};

export default ChangeDataForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
});
