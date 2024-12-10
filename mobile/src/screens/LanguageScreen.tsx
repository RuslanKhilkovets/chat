import {StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Screen} from '@/components';

const LanguageScreen = () => {
  const {t} = useTranslation();

  return <Screen title={t('screens.Language')}></Screen>;
};

export default LanguageScreen;

const styles = StyleSheet.create({});
