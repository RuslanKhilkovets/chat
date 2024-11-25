import React from 'react';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {enableScreens} from 'react-native-screens';

import {Navigation} from '@/navigation';
import {ChatProvider} from '@/context/Chat/ChatContext';
import {AuthProvider} from '@/context/Auth/AuthContext';
import {ThemeProvider} from '@/context/Theme/ThemeContext';
import store from './src/store';
import axios from 'axios';

enableScreens();
axios.defaults.baseURL = 'http://10.0.2.2:5000/api';

if (__DEV__) {
  require('./ReactotronConfig');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      cacheTime: 1000 * 60 * 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: false,
      select: ({data: {data}}) => data,
    },
    mutations: {
      cacheTime: 1000 * 60 * 1,
      retry: false,
    },
  },
});

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <ChatProvider>
            <ThemeProvider>
              <Toast />
              <Navigation />
            </ThemeProvider>
          </ChatProvider>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
