import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useForm, Controller, FieldValues} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import SInfo from 'react-native-sensitive-info';
import {useTranslation} from 'react-i18next';

import {Button, Input, PhoneInput} from '@/components';
import {useAuthMutation, useGoBack, useTypedSelector} from '@/hooks';
import {Api} from '@/api';
import {setUser} from '@/store/user';
import {ChangeDataType} from '@/constants';
import personalDataSchema from '@/validations/personalData';
import {IUser} from '@/types';

interface ChangeDataFormValues extends FieldValues {
  fieldToChange: string;
}

const ChangeDataForm: React.FC = () => {
  const {_id: userId} = useTypedSelector(state => state.user);
  const route =
    useRoute<RouteProp<{params: {type: ChangeDataType}}, 'params'>>();

  const {type} = route.params || {};
  const dispatch = useDispatch();

  const {t} = useTranslation();
  const goBack = useGoBack();

  const schema: yup.ObjectSchema<any> =
    personalDataSchema[type] || yup.object();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ChangeDataFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {fieldToChange: ''},
  });

  const {mutate: updateMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.update,
    onSuccess: async (res: {data: {user: IUser}}) => {
      const {user} = res.data;

      dispatch(setUser(user));
      await SInfo.setItem('user', JSON.stringify(user), {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychainService',
      });

      goBack();
    },
  });

  const onSubmit = (data: ChangeDataFormValues) => {
    const payload = {[type]: data.fieldToChange};
    updateMutation({userId, data: payload});
  };

  return (
    <View style={styles.container}>
      <Controller
        name="fieldToChange"
        control={control}
        render={({field: {onChange, value}}) =>
          type === ChangeDataType.PHONE ? (
            <PhoneInput
              value={value}
              onChange={onChange}
              placeholder={t(`actions.${type}`)}
              error={errors.fieldToChange?.message}
            />
          ) : (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder={type}
              error={errors.fieldToChange?.message}
              disabled={isLoading}
            />
          )
        }
      />
      <Button onPress={handleSubmit(onSubmit)} isLoading={isLoading}>
        {t('actions.Change') + ' ' + t(`actions.${type}`)}
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
