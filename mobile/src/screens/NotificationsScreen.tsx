import {StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Screen} from '@/components';

const NotificationsScreen = () => {
  const {t} = useTranslation();
  return <Screen title={t('screens.Notifications')}></Screen>;
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
