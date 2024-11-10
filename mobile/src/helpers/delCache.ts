import AsyncStorage from '@react-native-async-storage/async-storage';

export const delCache = async (key: string) =>
  await AsyncStorage.removeItem(key);

export default delCache;
