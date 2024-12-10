import {StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Screen} from '@/components';

const SavedScreen = () => {
  const {t} = useTranslation();

  return <Screen title={t('screens.Saved')}></Screen>;
};

export default SavedScreen;

const styles = StyleSheet.create({});
