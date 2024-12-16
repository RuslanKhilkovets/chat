import React from 'react';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {enableScreens} from 'react-native-screens';
import {LogLevel, OneSignal} from 'react-native-onesignal';

import {Navigation} from '@/navigation';
import {ChatProvider} from '@/context/Chat/ChatContext';
import {AuthProvider} from '@/context/Auth/AuthContext';
import {ThemeProvider} from '@/context/Theme/ThemeContext';
import store from './src/store';
import './i18n';

enableScreens();

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
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('3b3d85d8-5634-45c3-a958-d6def2bfdfe1');

  OneSignal.Notifications.requestPermission(true);
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

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
