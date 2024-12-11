import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Input, Screen, UserItem} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';
import {useTheme} from '@/context/Theme/ThemeContext';

const FindUsersScreen = () => {
  const {_id: currentUserId} = useTypedSelector(state => state.user);
  const {t} = useTranslation();
  const {theme, colorScheme} = useTheme();

  const [filterQuery, setFilterQuery] = useState('');
  const [users, setUsers] = useState([]);

  const {mutate: findUsersMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.findByNameOrTag,
    onSuccess: res => {
      const receivedUsers = res.data.users || [];
      const otherUsers = receivedUsers.filter(
        receivedUser => receivedUser?._id !== currentUserId,
      );

      setUsers(otherUsers);
    },
    onError: ({errors}) => {
      setUsers([]);
    },
  });

  useEffect(() => {
    if (filterQuery.trim()) {
      findUsersMutation(filterQuery);
    } else {
      setUsers([]);
    }
  }, [filterQuery]);

  return (
    <Screen title={t('screens.Search')}>
      <View style={styles.inputContainer}>
        <Input
          placeholder={t('chats.Search')}
          value={filterQuery}
          onChangeText={text => setFilterQuery(text)}
        />
      </View>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : users?.length !== 0 && filterQuery ? (
        <FlatList
          data={users}
          renderItem={({item}) => <UserItem user={item} />}
          keyExtractor={item => String(item?._id)}
        />
      ) : filterQuery ? (
        <View style={styles.centered}>
          <Text
            style={[
              styles.noChatsText,
              {color: theme[colorScheme].textPrimary},
            ]}>
            {t('warnings.NoChatsWithGivenData')}
          </Text>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text
            style={[
              styles.noChatsText,
              {color: theme[colorScheme].textPrimary},
            ]}>
            {t('actions.TypeSomething')}
          </Text>
        </View>
      )}
    </Screen>
  );
};

export default FindUsersScreen;

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 24,
    fontFamily: 'Jersey20-Regular',
    textAlign: 'center',
  },
});
