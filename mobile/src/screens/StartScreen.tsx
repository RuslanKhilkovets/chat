import * as React from 'react';
import {AboutModal, Logo} from '@/components';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import GoogleIcon from '@icons/GoogleIcon.svg';
import {useTheme} from '@/context/Theme/ThemeContext';
import {Button} from '@/components';

export const StartScreen = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);

  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const {theme, colorScheme} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {backgroundColor: theme[colorScheme].bgPrimary},
        styles.container,
      ]}>
      <Logo />
      <View style={{marginTop: 20}} />
      <Button
        onPress={() => {
          navigate('Login');
        }}
        type="primary"
        fullWidth>
        {t('actions.Login')}
      </Button>
      <Text style={[styles.text, {color: theme[colorScheme].textPrimary}]}>
        {t('actions.Or')}
      </Text>
      <Button
        onPress={() => {
          navigate('Register');
        }}
        type="primary"
        fullWidth>
        {t('actions.Register')}
      </Button>
      {/* <Button
        onPress={() => {}}
        type="primary"
        fullWidth
        style={{marginTop: 100}}
        before={<GoogleIcon />}>
        Sign in via Google
      </Button> */}
      <View style={{position: 'absolute', bottom: insets.bottom}}>
        <TouchableOpacity
          onPress={() => {
            setIsAboutModalOpen(true);
          }}
          activeOpacity={0.7}>
          <Text style={[styles.text, {color: theme[colorScheme].textPrimary}]}>
            About app
          </Text>
        </TouchableOpacity>
      </View>

      <AboutModal
        title="About"
        openFrom="bottom"
        visible={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 100,
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    marginVertical: 10,
    fontSize: 24,
    fontFamily: 'Jersey-Regular',
  },
});
