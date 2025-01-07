import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, Modal} from '@/components';
import {useTheme} from '@/context/Theme/ThemeContext';
import {PinCodeService} from '@/helpers';

interface PinModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setIsSecurityEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
  isVerification?: boolean;
  canClose?: boolean;
}

const PinCodeModal: React.FC<PinModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
  isVerification = false,
  setIsSecurityEnabled,
  canClose = true,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [remainingLockoutTime, setRemainingLockoutTime] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const {theme, colorScheme} = useTheme();
  const {t} = useTranslation();

  const handleInputChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < pin.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && !pin[index]) {
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const enteredPin = pin.join('');
    const savedPin = await PinCodeService.getPin();

    if (pin.some(value => value === '')) {
      setError(t('errors.FillAllFields'));
      return;
    }

    if (isVerification) {
      if (savedPin === enteredPin) {
        onSuccess();
        setError('');
        onClose();
      } else {
        const newAttempts = remainingAttempts - 1;
        setRemainingAttempts(newAttempts);

        if (newAttempts === 0) {
          setLockoutTime(Date.now() + 15000);
          setRemainingLockoutTime(15);
          setRemainingAttempts(3);
          setPin(['', '', '', '']);
        } else {
          setError(t('errors.incorrectPin'));
        }
      }
    } else {
      await PinCodeService.savePin(enteredPin);
      onSuccess();
      setError('');
      onClose();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (lockoutTime) {
      interval = setInterval(() => {
        const timeLeft = Math.max(
          0,
          Math.ceil((lockoutTime - Date.now()) / 1000),
        );
        setRemainingLockoutTime(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval!);
        }
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [lockoutTime]);

  return (
    <Modal
      canClose={canClose}
      visible={isVisible}
      onClose={() => {
        if (pin.some(cell => cell === '')) {
          setIsSecurityEnabled?.(false);
        }
        onClose();
        setPin(['', '', '', '']);
      }}
      
      title={t(isVerification ? 'modals.Verification' : 'modals.PinCode')}>
      <View style={styles.container}>
        {lockoutTime && remainingLockoutTime > 0 ? (
          <Text>
            {t('errors.lockoutMessage', {
              seconds: remainingLockoutTime,
            })}
          </Text>
        ) : (
          <>
            <View style={styles.inputContainer}>
              {pin.map((value, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[
                    styles.input,
                    {
                      borderColor: theme[colorScheme].border || '#ccc',
                      color: theme[colorScheme].textPrimary,
                    },
                  ]}
                  value={value}
                  onChangeText={text => handleInputChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(index);
                    }
                  }}
                  textAlign="center"
                />
              ))}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button
              onPress={handlePinSubmit}
              disabled={Boolean(lockoutTime && remainingLockoutTime > 0)}
              fullWidth
              style={{marginTop: 20}}>
              {isVerification
                ? t('actions.verifyPin')
                : t('actions.setPinCode')}
            </Button>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 20,
    padding: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default PinCodeModal;
