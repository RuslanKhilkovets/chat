import {useTheme} from '@/context/Theme/ThemeContext';
import {StyleSheet, Text} from 'react-native';

export const Logo = () => {
  const {theme, colorScheme} = useTheme();

  return (
    <Text style={[{color: "yellow"}, styles.logo]}>
      M
    </Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 240,
    fontWeight: 'bold',
    fontFamily: 'Jersey20-Regular',
  },
});

export default Logo;
