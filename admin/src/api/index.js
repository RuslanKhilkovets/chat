import axios from 'axios';

import apiAuth from './auth';

const client = axios.create({
  baseURL: import.meta.env.VITE_SOCKET_URL,
});

client.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    console.log('Error request', error);
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  response => response,
  error => {
    const errorStatus = error?.response?.status;
    const errorData = error?.response?.data;
    let reject = {
      status: errorStatus,
      title: 'Помилка сервера',
      message: 'Зверніться до адміністратора',
      errors: errorData,
    };

    switch (errorStatus) {
      case 401:
        reject = {
          status: errorStatus,
          title: 'Помилка авторизації',
          message: 'Логін та пароль не співпадають',
          errors: errorData?.errors,
        };
        break;
      case 400:
        let message = '';
        if (errorData?.errors) {
          const entries = Object.entries(errorData.errors);
          for (const [key, value] of entries) {
            message += `${key}: ${value?.join(', ')} `;
          }
        } else {
          message = 'An unknown error occurred.';
        }
        reject = {
          status: errorStatus,
          message: error.response.data?.message,
        };
        break;
    }
    return Promise.reject(reject);
  },
);

export const Api = {
  auth: apiAuth(client),
};
