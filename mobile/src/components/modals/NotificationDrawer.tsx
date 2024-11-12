import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {IModalProps} from '@/types';
import {Drawer} from '@/components';

interface NotificationDrawerProps extends IModalProps {}

const NotificationDrawer = ({visible, onClose}: NotificationDrawerProps) => {
  return (
    <Drawer visible={visible} onClose={onClose} openFrom="right">
      <Text>sdsdsd</Text>
    </Drawer>
  );
};

export default NotificationDrawer;

const styles = StyleSheet.create({});
