import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import RNSensitiveInfo from 'react-native-sensitive-info';
import RadioButton from 'react-native-radio-button';

import {BottomSheet, Screen, SettingsItem} from '@/components';
import {useTheme} from '@/context/Theme/ThemeContext';

const SettingsScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const {t, i18n} = useTranslation();
  const {theme, colorScheme} = useTheme();

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
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await RNSensitiveInfo.getItem('language', {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychain',
      });
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setSelectedLanguage(savedLanguage);
      }
    };

    loadLanguage();
  }, [i18n]);

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
      case 'Theme':
        return (
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>{t('screens.Theme')}</Text>
          </View>
        );
      case 'Notifications':
        return (
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>{t('screens.Notifications')}</Text>
          </View>
        );
      case 'Security':
        return (
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>{t('screens.Security')}</Text>
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
          iconName="light-mode"
          title={t('screens.Theme')}
          onPress={() => handleOpenBottomSheet('Theme')}
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
    </Screen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  infoBlock: {
    marginTop: 20,
    marginHorizontal: 20,
    gap: 10,
  },
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    color: 'yellow',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  radioGroup: {
    width: '100%',
    gap: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'yellow',
  },
});
