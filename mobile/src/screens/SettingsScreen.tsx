import {StyleSheet, Text, TouchableOpacity, View, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import RNSensitiveInfo from 'react-native-sensitive-info';
import RadioButton from 'react-native-radio-button';
import SInfo from 'react-native-sensitive-info';
import {OneSignal} from 'react-native-onesignal';
import {useTypedSelector} from '@/hooks';
import {BottomSheet, PinCodeModal, Screen, SettingsItem} from '@/components';
import {useTheme} from '@/context/Theme/ThemeContext';
import {PinCodeService} from '@/helpers';

const SettingsScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isNotificationsDisabled, setIsNotificationsDisabled] = useState(false);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(false);

  const {t, i18n} = useTranslation();
  const {theme, colorScheme} = useTheme();
  const user = useTypedSelector(state => state.user);

  const handleOpenBottomSheet = (type: string) => {
    setBottomSheetType(type);
    setIsVisible(true);
  };

  const saveLanguage = async (language: string) => {
    try {
      await RNSensitiveInfo.setItem('language', language, {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychain',
      });
      i18n.changeLanguage(language);
      setSelectedLanguage(language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const handleNotificationsToggle = () => {
    if (isNotificationsDisabled) {
      OneSignal.logout();
    } else {
      OneSignal.login(user?.playerId);
    }
    SInfo.setItem('notification_enabled', String(!isNotificationsDisabled), {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });

    setIsNotificationsDisabled(!isNotificationsDisabled);
  };

  const handleSecurityToggle = () => {
    if (!isSecurityEnabled) {
      setIsPinModalVisible(true);
    } else {
      PinCodeService.removePin();
    }
    setIsSecurityEnabled(!isSecurityEnabled);
  };

  useEffect(() => {
    const fetchStorage = async () => {
      const notification_enabled = await SInfo.getItem('notification_enabled', {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychainService',
      });
      const security_enabled = Boolean(await PinCodeService.getPin());

      setIsNotificationsDisabled(notification_enabled !== 'true');
      setIsSecurityEnabled(security_enabled);
    };

    fetchStorage();
  }, []);

  const renderBottomSheetContent = () => {
    switch (bottomSheetType) {
      case 'Language':
        return (
          <View style={styles.sheetContainer}>
            <Text
              style={[
                styles.sheetTitle,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('screens.Language')}
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => saveLanguage('en')}>
                <RadioButton
                  isSelected={selectedLanguage === 'en'}
                  onPress={() => saveLanguage('en')}
                  color={theme[colorScheme].textPrimary}
                />
                <Text
                  style={[
                    styles.radioText,
                    {color: theme[colorScheme].textPrimary},
                  ]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => saveLanguage('uk')}>
                <RadioButton
                  isSelected={selectedLanguage === 'uk'}
                  onPress={() => saveLanguage('uk')}
                  color="yellow"
                />
                <Text
                  style={[
                    styles.radioText,
                    {color: theme[colorScheme].textPrimary},
                  ]}>
                  Українська
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Notifications':
        return (
          <View style={styles.sheetContainer}>
            <Text
              style={[
                styles.sheetTitle,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('screens.Notifications')}
            </Text>
            <View style={styles.checkboxContainer}>
              <Text
                style={[
                  styles.radioText,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {t('actions.disableNotifications')}
              </Text>
              <Switch
                value={isNotificationsDisabled}
                onValueChange={handleNotificationsToggle}
              />
            </View>
          </View>
        );
      case 'Security':
        return (
          <View style={styles.sheetContainer}>
            <Text
              style={[
                styles.sheetTitle,
                {color: theme[colorScheme].textPrimary},
              ]}>
              {t('screens.Security')}
            </Text>
            <View style={styles.checkboxContainer}>
              <Text
                style={[
                  styles.radioText,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {t('actions.usePinCode')}
              </Text>
              <Switch
                value={isSecurityEnabled}
                onValueChange={handleSecurityToggle}
              />
            </View>
          </View>
        );

      default:
        return <Text>Unexpected Error</Text>;
    }
  };

  return (
    <Screen title={t('screens.Settings')}>
      <View style={styles.infoBlock}>
        <SettingsItem
          iconName="language"
          title={t('screens.Language')}
          onPress={() => handleOpenBottomSheet('Language')}
        />
        <SettingsItem
          iconName="notifications"
          title={t('screens.Notifications')}
          onPress={() => handleOpenBottomSheet('Notifications')}
        />
        <SettingsItem
          iconName="security"
          title={t('screens.Security')}
          onPress={() => handleOpenBottomSheet('Security')}
        />
      </View>

      <BottomSheet visible={isVisible} onClose={() => setIsVisible(false)}>
        {renderBottomSheetContent()}
      </BottomSheet>

      <PinCodeModal
        onClose={() => setIsPinModalVisible(false)}
        isVisible={isPinModalVisible}
        setIsSecurityEnabled={setIsSecurityEnabled}
        onSuccess={() => setIsSecurityEnabled(true)}
        canClose
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 15,
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  pinModalTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  radioGroup: {
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioText: {
    marginLeft: 10,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  timeText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  infoBlock: {
    margin: 20,
    gap: 10,
  },
});

export default SettingsScreen;
