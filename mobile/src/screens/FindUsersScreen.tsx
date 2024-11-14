import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Screen} from '@/components';
import {useAuthMutation} from '@/hooks';
import {Api} from '@/api';

const FindUsersScreen = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const {mutate: findUsers, isLoading} = useAuthMutation({
    mutationFn: Api.users.findByNameOrTag,
    onSuccess: res => {
      console.log(res);
    },
  });

  useEffect(() => {
    filterQuery && findUsers(filterQuery);
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
    </Screen>
  );
};

export default FindUsersScreen;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 20,
  },
});
