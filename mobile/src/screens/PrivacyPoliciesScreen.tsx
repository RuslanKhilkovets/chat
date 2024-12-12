import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {Button, Screen} from '@/components';
import {useAnimatedTyping, useGoBack} from '@/hooks';
import {useTheme} from '@/context/Theme/ThemeContext';

const PrivacyPoliciesScreen = () => {
  const goBack = useGoBack();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const fullText =
    '    MChat is committed to protecting your privacy. Our app uses end-to-end encryption to ensure that your messages, calls, and shared media remain secure and accessible only to you and your intended recipients. ' +
    '\n    We do not store or share your private data, and we provide additional security features like multi-factor authentication and biometric access to keep your information safe. ' +
    '\n    Our policies ensure that no data is shared with third parties without your consent, and we give you full control over your personal information. For added protection, MChat offers features like self-destructing messages and screen lock options to safeguard your conversations. ' +
    '\n    Your security is our priority, and we are committed to maintaining a safe environment for your personal and professional communications.';

  const {displayedText, cursorVisible} = useAnimatedTyping({
    fullText,
    visible: true,
  });

  return (
    <Screen title={t('screens.Policies')}>
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
              color={theme[colorScheme].textPrimary}
              size={16}
            />
          }
          onPress={goBack}>
          {t('actions.GoBack')}
        </Button>
      </View>
    </Screen>
  );
};

export default PrivacyPoliciesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 20,
    paddingBottom: 100,
    lineHeight: 26,
    fontSize: 22,
    fontFamily: 'Jersey20-Regular',
  },
});
