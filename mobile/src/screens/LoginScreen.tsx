import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';

import {Input, Screen} from '@/components';
import {Button} from '@/components';
import {useAuthMutation} from '@/hooks';
import {useAuthContext} from '@/context/Auth/AuthContext';
import loginSchema from '@/validations/login';
import {Api} from '@/api';
import {useTheme} from '@/context/Theme/ThemeContext';
import {resetUser} from '@/store/user';

export const LoginScreen = () => {
  const [formErrors, setFormErrors] = React.useState<any>({
    password: '',
    email: '',
  });
  const [error, setError] = React.useState<any>(false);
  const {login} = useAuthContext();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

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
    setError(true);
  };
  const dispatch = useDispatch();

  const {mutate: onLogin, isLoading} = useAuthMutation({
    mutationFn: Api?.auth?.login,
    onError: onLoginError,
    onSuccess: onLoginSuccess,
  });

  const onSubmit = (data: ISignData) => {
    onLogin(data);
  };

  // const onForgotPassword = () => {
  //   navigation.navigate('ResetPassword');
  // };

  React.useEffect(() => {
    dispatch(resetUser());
  }, []);

  return (
    <Screen>
      <View style={[styles.container, {padding: 20}]}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={[
              styles.screenLabel,
              {color: theme[colorScheme].textPrimary},
            ]}>
            Sign in
          </Text>
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
              placeholder={t('input.Password')}
              value={value}
              onChangeText={onChange}
              error={errors?.password?.message || formErrors?.password}
              secureTextEntry
            />
          )}
        />
        {error && !formErrors.password && !formErrors.email && (
          <Text style={styles.error}>Incorrect email or password</Text>
        )}
        {/* <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.text}>Forget password?</Text>
        </TouchableOpacity> */}
        <Button
          onPress={handleSubmit(onSubmit)}
          type="primary"
          fullWidth
          isLoading={isLoading}>
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
    fontFamily: 'Jersey-Regular',
    textAlign: 'center',
  },
  screenLabel: {
    fontSize: 50,
    fontFamily: 'Jersey-Regular',
    marginVertical: 70,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});
