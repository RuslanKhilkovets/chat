import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Screen, UserItem} from '@/components';
import {useAuthMutation} from '@/hooks';
import {Api} from '@/api';

const FindUsersScreen = () => {
  const [filterQuery, setFilterQuery] = useState('');
  const [users, setUsers] = useState([]);

  const {mutate: findUsersMutation, isLoading} = useAuthMutation({
    mutationFn: Api.users.findByNameOrTag,
    onSuccess: res => {
      setUsers(res.data.users);
      console.log(res.data.users);
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
      ) : (
        <FlatList
          data={users}
          renderItem={({item}) => <UserItem user={item} />}
          keyExtractor={({item}) => String(item?._id)}
        />
      )}
    </Screen>
  );
};

export default FindUsersScreen;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 20,
  },
});
const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 20,
  },
});
