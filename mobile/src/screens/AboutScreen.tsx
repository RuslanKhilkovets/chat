import {ScrollView, StyleSheet, Text} from 'react-native';
import React from 'react';
import {Button, Screen} from '@/components';
import {useGoBack} from '@/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAnimatedTyping from '@/hooks/useAnimatedTyping';

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

  return (
    <Screen title="About">
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
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
  },
  cursor: {
    color: '#E1FF00',
  },
});
