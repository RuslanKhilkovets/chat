import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Screen, UserItem} from '@/components';
import {useAuthMutation, useTypedSelector} from '@/hooks';
import {Api} from '@/api';

const FindUsersScreen = () => {
  const {_id: currentUserId} = useTypedSelector(state => state.user);

  const [filterQuery, setFilterQuery] = useState('');
  const [users, setUsers] = useState([]);

  const {mutate: findUsersMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.findByNameOrTag,
    onSuccess: res => {
      const receivedUsers = res.data.users;
      if (receivedUsers) {
        const otherUsers = receivedUsers.filter(
          receivedUser => receivedUser?._id !== currentUserId,
        );

        setUsers(otherUsers);
      }
    },
    onError: ({errors}) => {
      setUsers(errors.users);
    },
  });

  useEffect(() => {
    filterQuery && findUsersMutation(filterQuery);
  }, [filterQuery]);

  return (
    <Screen title="Search">
      <View style={styles.inputContainer}>
        <Input
          placeholder="Search..."
          value={filterQuery}
          onChangeText={text => setFilterQuery(text)}
        />
      </View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : users?.length !== 0 && filterQuery ? (
        <FlatList
          data={users}
          renderItem={({item}) => <UserItem user={item} />}
          keyExtractor={({item}) => String(item?._id)}
        />
      ) : filterQuery ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noChatsText}>
            There are no users with given data!
          </Text>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noChatsText}>Type something...</Text>
        </View>
      )}
    </Screen>
  );
};

export default FindUsersScreen;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 20,
  },
  noChatsText: {
    fontSize: 24,
    fontFamily: 'Jersey20-Regular',
    color: '#E1FF00',
    textAlign: 'center',
  },
});
