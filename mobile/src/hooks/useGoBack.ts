import {useNavigation} from '@react-navigation/native';

const useGoBack = () => {
  const navigation = useNavigation();

  return () => {
    navigation.canGoBack() && navigation.goBack();
  };
};

export default useGoBack;
