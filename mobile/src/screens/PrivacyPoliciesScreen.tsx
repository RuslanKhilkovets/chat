import {ScrollView, StyleSheet, Text} from 'react-native';
import React from 'react';
import {Button, Screen} from '@/components';
import {useAnimatedTyping, useGoBack} from '@/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivacyPoliciesScreen = () => {
  const goBack = useGoBack();

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
    <Screen title="Privacy policies">
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          {displayedText}
          {cursorVisible && <Text style={styles.cursor}>|</Text>}
        </Text>
      </ScrollView>
      <Button
        before={<Icon name="arrow-back-ios" color={'yellow'} size={16} />}
        onPress={goBack}>
        Go back
      </Button>
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
    color: '#E1FF00',
  },
  cursor: {
    color: '#E1FF00',
  },
});
