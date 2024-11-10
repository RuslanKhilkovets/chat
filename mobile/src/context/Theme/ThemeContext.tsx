import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {themes} from '@/context';

interface ThemeContextProps {
  colorScheme: 'light' | 'dark';
  setColorScheme: (value: 'light' | 'dark') => void;
  theme: any;
}

const ThemeContext = createContext<ThemeContextProps>({
  colorScheme: 'light',
  setColorScheme: () => {},
  theme: [],
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}: React.PropsWithChildren) => {
  const deviceColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    deviceColorScheme || 'light',
  );

  useEffect(() => {
    setColorScheme(deviceColorScheme || 'light');
  }, [deviceColorScheme]);

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
