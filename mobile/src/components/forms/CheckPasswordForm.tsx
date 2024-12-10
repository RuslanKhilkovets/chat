import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, Input} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';

interface ICheckPasswordFormProps {
  setIsPasswordChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckPasswordForm = ({setIsPasswordChecked}: ICheckPasswordFormProps) => {
  const {_id: userId} = useTypedSelector(state => state.user);

  const {t} = useTranslation();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {mutate: checkPasswordMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.checkPassword,
    onSuccess: () => {
      setIsPasswordChecked(true);
    },
    onError: () => {
      setError(t('errors.IncorrectPassword'));
    },
  });

  const checkPassword = (id, password) => {
    if (!password) {
      setError(t('errors.FieldMustBeFilled'));
      return;
    }
    const payload = {
      id,
      password,
    };

    checkPasswordMutation(payload);
  };

  return (
    <View style={styles.container}>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder={t('inputs.Password')}
        error={error}
        disabled={isLoading}
        secureTextEntry
      />
      <Button
        onPress={() => checkPassword(userId, password)}
        isLoading={isLoading}>
        {t('actions.CheckPassword')}
      </Button>
    </View>
  );
};

export default CheckPasswordForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
});
