import React, {useState, useEffect, useContext} from 'react';
import SInfo from 'react-native-sensitive-info';
import jwt_decode from 'jwt-decode';
import {OneSignal} from 'react-native-onesignal';

import {useDispatch} from 'react-redux';
import {resetUser, setUser} from '@/store/user';
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
    const fetchToken = async () => {
      try {
        const token = await SInfo.getItem('accessToken', {
          sharedPreferencesName: 'prefs',
          keychainService: 'keychainService',
        });

        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchToken();
  }, []);

  const getToken = async () => {
    if (accessToken) {
      const {exp} = jwt_decode(accessToken);
      if (new Date().getTime() < exp * 1000) {
        console.log('Access Token active');
        return accessToken;
      }
    }

    return null;
  };

  const login = async userData => {
    setAccessToken(userData.token);
    dispatch(setUser(userData));

    if (userData && userData.playerId) {
      OneSignal.login(userData.playerId);
    }

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
    await SInfo.deleteItem('accessToken', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });

    await SInfo.deleteItem('user', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychainService',
    });
    setAccessToken(null);
    dispatch(resetUser());

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
