import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

import {ChangeDataForm, CheckPasswordForm, Screen} from '@/components';

const ChangePersonalDataScreen = () => {
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const route = useRoute();
  const {type} = route.params || {};

  const carouselRef = useRef<any>();
  const screenWidth = Dimensions.get('window').width;

  const slides = [
    <CheckPasswordForm setIsPasswordChecked={setIsPasswordChecked} />,
    <ChangeDataForm />,
  ];

  useEffect(() => {
    if (isPasswordChecked) {
      carouselRef?.current?.snapToNext();
    }
  }, [isPasswordChecked]);

  return (
    <Screen title={type}>
      <View style={{flex: 1}}>
        <Carousel
          ref={carouselRef}
          data={slides}
          renderItem={({item}) => item}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          firstItem={0}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          scrollEnabled={false}
        />
      </View>
    </Screen>
  );
};

export default ChangePersonalDataScreen;

const styles = StyleSheet.create({});
