import * as React from 'react';
import {View, TouchableOpacity, StyleSheet, Animated, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {Input, MenuDrawer} from '@/components';
import {useChatContext} from '@/context/Chat/ChatContext';

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {filterQuery, setFilterQuery} = useChatContext();
  const {t} = useTranslation();

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
            if (!isSearchOpen) setIsDrawerOpen(true);
            else handleSearchToggle();
          }}
          style={styles.iconButton}>
          <Icon
            name={isSearchOpen ? 'arrow-back-ios' : 'menu'}
            size={32}
            color="yellow"
          />
        </TouchableOpacity>
        <Text style={styles.textLogo}>MChat</Text>
      </View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            width: searchWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
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
          <Icon name="search" size={30} color="yellow" />
        </TouchableOpacity>
      )}

      <MenuDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
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
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    overflow: 'hidden',
    position: 'absolute',
    left: 40,
    backgroundColor: '#000',
  },
  searchInput: {
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textLogo: {
    color: 'yellow',
    fontSize: 28,
    fontFamily: 'Jersey20-Regular',
  },
});

export default Header;
