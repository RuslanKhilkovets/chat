import React, {useState, useEffect, useContext} from 'react';
import SInfo from 'react-native-sensitive-info';
import jwt_decode from 'jwt-decode';
import {OneSignal} from 'react-native-onesignal';

import {useDispatch} from 'react-redux';
import {setUser} from '@/store/user';
import {useTypedSelector} from '@/hooks';

export const AuthContext = React.createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState(null);
  const currentUser = useTypedSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    // Отримуємо токен доступу з захищеного місця збереження
    SInfo.getItem('accessToken', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    }).then(token => {
      token && setAccessToken(token);
    });
  }, []);

  const getToken = async () => {
    if (accessToken) {
      const {exp} = jwt_decode(accessToken);
      if (new Date().getTime() < exp * 1000) {
        console.log('Access Token actived');
        return accessToken;
      }
    }

    await logout();
    return null;
  };

  const login = async userData => {
    setAccessToken(userData.token);
    dispatch(setUser(userData));

    if (userData && userData.playerId) {
      OneSignal.login(userData.playerId);
    }

    // Зберігаємо токен доступу в захищеному місці збереження
    await SInfo.setItem('accessToken', userData.token, {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
    await SInfo.setItem('user', JSON.stringify(userData), {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
  };

  const logout = async () => {
    console.log('logout');

    await SInfo.deleteItem('accessToken', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });

    await SInfo.deleteItem('user', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
    setAccessToken(null);
    dispatch(setUser(null));

    OneSignal.logout(currentUser?.playerId);
  };

  useEffect(() => {
    accessToken &&
      (async () => {
        await SInfo.setItem('accessToken', accessToken, {
          sharedPreferencesName: 'prefs',
          keychainService: 'keychainService',
        });
      })();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        login,
        logout,
        getToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
