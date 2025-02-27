import * as React from 'react';
import {View, TouchableOpacity, StyleSheet, Animated, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {Input} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';
import {useTheme} from '@/context/Theme/ThemeContext';

interface IHeaderProps {
  openMenu: () => void;
}

export const Header = ({openMenu}: IHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {filterQuery, setFilterQuery} = useChatContext();
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const searchWidth = React.useRef(
    new Animated.Value(isSearchOpen ? 1 : 0),
  ).current;

  const handleSearchToggle = () => {
    if (setFilterQuery) setFilterQuery('');
    setIsSearchOpen(prev => !prev);

    Animated.timing(searchWidth, {
      toValue: isSearchOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
        <TouchableOpacity
          onPress={() => {
            if (!isSearchOpen) openMenu();
            else handleSearchToggle();
          }}
          style={styles.iconButton}>
          <Icon
            name={isSearchOpen ? 'arrow-back-ios' : 'menu'}
            size={32}
            color={theme[colorScheme].textPrimary}
          />
        </TouchableOpacity>
        <Text
          style={[styles.textLogo, {color: theme[colorScheme].textPrimary}]}>
          MChat
        </Text>
      </View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            width: searchWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: theme[colorScheme].bgPrimary,
          },
        ]}>
        {isSearchOpen && (
          <Input
            transparent
            autoFocus
            style={styles.searchInput}
            placeholder={t('chats.Search')}
            value={filterQuery}
            onChangeText={setFilterQuery}
          />
        )}
      </Animated.View>

      {!isSearchOpen && (
        <TouchableOpacity
          onPress={handleSearchToggle}
          style={styles.iconButton}>
          <Icon
            name="search"
            size={30}
            color={theme[colorScheme].textPrimary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    overflow: 'hidden',
    position: 'absolute',
    left: 40,
  },
  searchInput: {
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textLogo: {
    fontSize: 28,
    fontFamily: 'Jersey-Regular',
  },
});

export default Header;
