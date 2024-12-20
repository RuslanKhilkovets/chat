import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, View} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import {useDispatch} from 'react-redux';
import {OneSignal} from 'react-native-onesignal';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {privateRoutes, publicRoutes} from '@/navigation';
import {Logo, PinCodeModal} from '@/components';
import {setUser} from '@/store/user';
import {useAuthContext} from '@/context/Auth/AuthContext';
import SplashScreen from 'react-native-splash-screen';
import {useAuthMutation} from '@/hooks';
import {Api} from '@/api';
import {PinCodeService} from '@/helpers';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const {accessToken} = useAuthContext();
  const dispatch = useDispatch();

  const {mutate: updatePlayerId} = useAuthMutation({
    mutateFn: Api.users.update,
    onSuccess: res => {
      console.log(res);
    },
  });

  const getToken = async () => {
    const accessToken = await SInfo.getItem('accessToken', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
    return accessToken;
  };

  const getUser = async () => {
    const user = await SInfo.getItem('user', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
    return user && JSON.parse(user);
  };

  useEffect(() => {
    (async () => {
      const savedPin = await PinCodeService.getPin();

      setShowPinModal(savedPin);
    })();

    const fetchToken = async () => {
      const accessToken = await getToken();
      const user = await getUser();

      setIsAuth(!!accessToken);
      dispatch(setUser(user));

      const playerId = await OneSignal.User.getOnesignalId();
      if (playerId) {
        updatePlayerId({playerId});
      }

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    setIsAuth(!!accessToken);
  }, [accessToken]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Logo />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          {!!isAuth
            ? privateRoutes.map((route: IRoute) => (
                <Stack.Screen
                  {...route}
                  key={route.name}
                  options={{headerShown: false}}
                />
              ))
            : publicRoutes.map((route: IRoute) => (
                <Stack.Screen
                  {...route}
                  key={route.name}
                  options={{headerShown: false}}
                />
              ))}
        </Stack.Navigator>
      </NavigationContainer>
      <PinCodeModal
        isVisible={showPinModal && isAuth}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => setShowPinModal(false)}
        isVerification
      />
    </SafeAreaProvider>
  );
};

export default Navigation;
