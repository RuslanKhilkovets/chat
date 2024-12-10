import * as React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';

import {Input, Screen} from '@/components';
import {Button} from '@/components';
import {useAuthMutation} from '@/hooks';
import {AuthContext} from '@/context/Auth/AuthContext';
import loginSchema from '@/validations/login';
import {Api} from '@/api';

export const LoginScreen = () => {
  const [formErrors, setFormErrors] = React.useState<any>({
    password: '',
    email: '',
  });
  const {login} = React.useContext(AuthContext);
  const {t} = useTranslation();

  const navigation = useNavigation();
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ISignData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSuccess = async (res: any) => {
    login(res.data);
    reset();
    navigation.navigate('Chats');
  };

  const onLoginError = (errors: any) => {
    setFormErrors({
      email: errors?.errors?.email ? errors.errors.email[0] : '',
      password: errors?.errors?.password ? errors.errors.password[0] : '',
    });
  };

  const {mutate: onLogin, isLoading} = useAuthMutation({
    mutationFn: Api?.auth?.login,
    onError: onLoginError,
    onSuccess: onLoginSuccess,
  });

  const onSubmit = (data: ISignData) => {
    onLogin(data);
  };

  const onForgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (
    <Screen>
      <View
        style={[styles.container, Platform.OS === 'android' && {padding: 20}]}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.screenLabel}>Sign in</Text>
        </View>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder="E-mail"
              value={value}
              onChangeText={onChange}
              error={errors?.email?.message || formErrors?.email}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <Input
              placeholder={t('inputs.Password')}
              value={value}
              onChangeText={onChange}
              error={errors?.password?.message || formErrors?.password}
              secureTextEntry
            />
          )}
        />
        {/* <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.text}>Forget password?</Text>
        </TouchableOpacity> */}
        <Button onPress={handleSubmit(onSubmit)} type="primary" fullWidth>
          {t('actions.SignIn')}
        </Button>
      </View>
    </Screen>
  );
};

export default LoginScreen;

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
