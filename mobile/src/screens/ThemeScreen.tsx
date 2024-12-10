import {StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Screen} from '@/components';

const ThemeScreen = () => {
  const {t} = useTranslation();
  return <Screen title={t('screens.Theme')}></Screen>;
};

export default ThemeScreen;

const styles = StyleSheet.create({});
