import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {Button, Screen} from '@/components';
import {useGoBack, useAnimatedTyping} from '@/hooks';
import {useTheme} from '@/context/Theme/ThemeContext';

const AboutScreen = () => {
  const fullText =
    '    Welcome to MChat – your secure, privacy-focused messaging app designed to keep your conversations safe and private. ' +
    'MChat leverages state-of-the-art end-to-end encryption to ensure that only you and the intended recipients can access your messages, calls, and shared files. ' +
    'From sensitive business communications to personal messages, MChat’s multi-layered security protocols are built to protect your data from any unauthorized access or interception. ' +
    'With MChat, you have complete control over your digital footprint. \n    Features like self-destructing messages allow you to set time limits on sensitive conversations, ' +
    'while screenshot protection and screen lock options add an extra layer of privacy. MChat’s secure cloud storage lets you save your conversations without compromising security, ' +
    'and only you can retrieve them through multi-factor authentication and biometric access.';

  const {displayedText, cursorVisible} = useAnimatedTyping({
    fullText,
  });
  const goBack = useGoBack();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  return (
    <Screen title={t('screens.About')}>
      <ScrollView style={styles.container}>
        <Text style={[styles.text, {color: theme[colorScheme].textPrimary}]}>
          {displayedText}
          {cursorVisible && (
            <Text style={{color: theme[colorScheme].textPrimary}}>|</Text>
          )}
        </Text>
      </ScrollView>
      <View style={{marginHorizontal: 20}}>
        <Button
          before={
            <Icon
              name="arrow-back-ios"
              color={theme[colorScheme].dark}
              size={24}
            />
          }
          onPress={goBack}>
          {t('actions.GoBack')}
        </Button>
      </View>
    </Screen>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 20,
    paddingBottom: 100,
    lineHeight: 26,
    fontSize: 22,
    fontFamily: 'Jersey-Regular',
  },
});
