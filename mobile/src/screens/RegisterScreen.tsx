import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {
  Input,
  KeyboardScroll,
  PhoneInput,
  PrivacyPolicyModal,
  Screen,
} from '@/components';
import {Button} from '@/components';
import {useAuthMutation} from '@/hooks';
import {Api} from '@/api';
import registerSchema from '@/validations/register';
import {useTheme} from '@/context/Theme/ThemeContext';
import {AuthContext} from '@/context/Auth/AuthContext';

export const LoginScreen = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<any>({
    email: '',
    password: '',
    name: '',
    phone: '',
    token: '',
  });
  const {register} = React.useContext(AuthContext);
  const {theme, colorScheme} = useTheme();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  const navigation = useNavigation();
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      token: '',
    },
  });

  const onRegisterSuccess = async (res: any) => {
    // TODO: add logic

    reset();
    navigation.navigate('Consent');
  };

  const onRegisterError = ({errors}: any) => {
    setFormErrors({
      email: errors?.errors?.email ? errors.errors.email[0] : '',
      password: errors?.errors?.password ? errors.errors.password[0] : '',
    });
  };

  const {mutate: onRegister, isLoading} = useAuthMutation({
    mutationFn: Api?.auth?.register,
    onError: onRegisterError,
    onSuccess: onRegisterSuccess,
  });

  const onSubmit = (data: any) => {
    onRegister({...data, registerToken: data.token});
  };

  return (
    <Screen>
      <View style={[styles.container]}>
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.screenLabel, theme[colorScheme].textPrimary]}>
            Register
          </Text>
        </View>
        <KeyboardScroll>
          <View style={{gap: 20, paddingVertical: 20}}>
            <Controller
              control={control}
              name="token"
              render={({field: {onChange, value}}) => (
                <Input
                  placeholder={t('input.AccessToken')}
                  value={value}
                  onChangeText={onChange}
                  error={errors?.token?.message || formErrors?.token}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <Input
                  placeholder={t('input.Name')}
                  value={value}
                  onChangeText={onChange}
                  error={errors?.password?.message || formErrors?.password}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, value}}) => (
                <PhoneInput
                  placeholder={t('input.Phone')}
                  value={value}
                  onChange={onChange}
                  error={errors?.password?.message || formErrors?.password}
                />
              )}
            />
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
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            type="primary"
            fullWidth
            isLoading={isLoading}>
            {t('actions.Register')}
          </Button>
        </KeyboardScroll>
        {/* <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            left: 15,
          }}>
          <Text style={styles.text}>By registering, you accepting our </Text>
          <TouchableOpacity
            onPress={() => {
              setIsPrivacyModalOpen(true);
            }}
            activeOpacity={0.7}>
            <Text style={[styles.text, {color: 'blue'}]}>Privacy policy</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <PrivacyPolicyModal
        title={t('modals.PrivacyPolicy')}
        openFrom="bottom"
        visible={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    textAlign: 'center',
  },
  screenLabel: {
    fontSize: 50,
    fontFamily: 'Jersey20-Regular',
    marginVertical: 50,
  },
});
