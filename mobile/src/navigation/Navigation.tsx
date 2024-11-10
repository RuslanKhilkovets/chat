import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, View} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import {useDispatch} from 'react-redux';

import {privateRoutes, publicRoutes} from '@/navigation';
import {IRoute} from '@/types';
import {Logo} from '@/components';
import {setUser} from '@/store/user';
import {AuthContext} from '@/context/Auth/AuthContext';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const {accessToken} = useContext(AuthContext);
  const dispatch = useDispatch();

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
    const fetchToken = async () => {
      const accessToken = await getToken();
      const user = await getUser();

      setIsAuth(!!accessToken);
      dispatch(setUser(user));

      // Simulate loading for 5 seconds
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    };

    fetchToken();
  });

  useEffect(() => {
    if (accessToken) {
      setIsAuth(!!accessToken);
    }
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
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={'transparent'}
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
    </>
  );
};

export default Navigation;
