import React, {createContext, useContext, useState, useEffect} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import SInfo from 'react-native-sensitive-info';

import {themes} from '@/context';

interface Themes {
  light: object;
  dark: object;
}

interface ThemeContextProps {
  colorScheme: ColorSchemeName;
  setColorScheme: (value: ColorSchemeName) => void;
  theme: Themes;
}

const ThemeContext = createContext<ThemeContextProps>({
  colorScheme: 'light',
  setColorScheme: () => {},
  theme: {light: {}, dark: {}},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}: React.PropsWithChildren) => {
  const deviceColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    deviceColorScheme || 'light',
  );
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);

  useEffect(() => {
    isThemeLoaded &&
      SInfo.setItem('colorScheme', String(colorScheme), {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychainService',
      });
  }, [colorScheme, isThemeLoaded]);

  useEffect(() => {
    (async () => {
      const themeFromStorage = await SInfo.getItem('colorScheme', {
        sharedPreferencesName: 'prefs',
        keychainService: 'keychainService',
      });

      console.log(themeFromStorage, 'themeFromStorage');

      if (themeFromStorage === 'light' || themeFromStorage === 'dark') {
        setColorScheme(themeFromStorage);
      }
      setIsThemeLoaded(true);
    })();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme: themes,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default {
  useTheme,
  ThemeProvider,
};
