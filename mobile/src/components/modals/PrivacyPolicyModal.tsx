import {ScrollView, StyleSheet, Text} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Modal} from '@/components';
import {IModalProps} from '@/types';
import {useAnimatedTyping} from '@/hooks';

const PrivacyPoliceModal = ({visible, onClose, openFrom}: IModalProps) => {
  const fullText =
    '    MChat is committed to protecting your privacy. Our app uses end-to-end encryption to ensure that your messages, calls, and shared media remain secure and accessible only to you and your intended recipients. ' +
    'We do not store or share your private data, and we provide additional security features like multi-factor authentication and biometric access to keep your information safe. ' +
    'Our policies ensure that no data is shared with third parties without your consent, and we give you full control over your personal information. For added protection, MChat offers features like self-destructing messages and screen lock options to safeguard your conversations. ' +
    'Your security is our priority, and we are committed to maintaining a safe environment for your personal and professional communications.';

  const {t} = useTranslation();

  const {displayedText, cursorVisible} = useAnimatedTyping({
    fullText,
    visible,
  });

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('modals.PrivacyPolicy')}
      openFrom={openFrom}>
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          {displayedText}
          {cursorVisible && <Text style={styles.cursor}>|</Text>}
        </Text>
      </ScrollView>
    </Modal>
  );
};

export default PrivacyPoliceModal;

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
    color: '#E1FF00',
  },
  cursor: {
    color: '#E1FF00',
  },
});
