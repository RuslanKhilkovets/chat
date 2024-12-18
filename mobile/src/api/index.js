import axios from 'axios';
import SInfo from 'react-native-sensitive-info';
import {SERVER_URL} from '@env';

import apiAuth from './auth';
import apiChats from './chats';
import apiUsers from './users';
import apiMessages from './messages';
import apiMedia from './media';

const client = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

client.interceptors.request.use(
  async config => {
    const accessToken = await SInfo.getItem('accessToken', {
      sharedPreferencesName: 'prefs',
      keychainService: 'keychain',
    });

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  error => {
    console.log('Error request', error);
    return Promise.reject(error);
  },
);

export const Api = {
  auth: apiAuth(client),
  chats: apiChats(client),
  users: apiUsers(client),
  messages: apiMessages(client),
  media: apiMedia(client),
};
