import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {GoBack, SmallModal} from '@/components';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useChatContext} from '@/context/Chat/ChatContext';
import {getAvatarColor} from '@/helpers';
import {useTheme} from '@/context/Theme/ThemeContext';
import {useGoBack} from '@/hooks';

interface IScreenHeaderProps {
  chatMode?: boolean;
  payload?: any;
  title?: string;
}

const ScreenHeader = ({title, payload, chatMode}: IScreenHeaderProps) => {
  const {navigate} = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const {deleteChat} = useChatContext();
  const {theme, colorScheme} = useTheme();
  const {t} = useTranslation();
  const goBack = useGoBack();

  const handleDelete = () => {
    deleteChat(payload?.chatId);
    setModalVisible(false);
    goBack();
  };

  return (
    <>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme[colorScheme].bgSecondary,
            paddingVertical: !!title || !!payload ? 10 : 30,
          },
          !chatMode && {justifyContent: 'center'},
        ]}>
        <View style={styles.icon}>
          <GoBack />
        </View>

        {title && (
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme[colorScheme].textPrimary,
              },
            ]}>
            {title}
          </Text>
        )}

        {payload && (
          <Pressable
            style={styles.userInfo}
            onPress={() => navigate('Profile', {userId: payload.userId})}>
            <View
              style={[
                styles.profilePic,
                {backgroundColor: getAvatarColor(payload.userId)},
              ]}>
              <Text
                style={[
                  styles.profilePicText,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {payload?.name?.[0]?.toUpperCase() || ''}
              </Text>
            </View>
            <View>
              <Text
                style={[styles.name, {color: theme[colorScheme].textPrimary}]}>
                {payload.name}
              </Text>
              <Text
                style={[
                  styles.isOnline,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {payload.isTyping
                  ? t('actions.Typing')
                  : payload.isOnline
                  ? t('actions.Online')
                  : t('actions.Offline')}
              </Text>
            </View>
          </Pressable>
        )}

        {chatMode && (
          <TouchableOpacity
            style={styles.deleteIcon}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}>
            <Icon
              name="delete"
              color={theme[colorScheme].textPrimary}
              size={32}
            />
          </TouchableOpacity>
        )}
      </View>

      <SmallModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        text={t('actions.DeleteChatAgreementTitle')}
        confirmText={t('actions.Delete')}
        cancelText={t('actions.Cancel')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 15,
    zIndex: 9999,
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#5d5d5d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'yellow',
  },
  userInfo: {
    marginLeft: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerTitle: {
    zIndex: 1,
    color: 'yellow',
    fontSize: 26,
    fontFamily: 'Jersey-Regular',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  name: {
    color: 'yellow',
    fontSize: 22,
    fontFamily: 'Jersey-Regular',
  },
  isOnline: {
    color: 'yellow',
    fontSize: 16,
    fontFamily: 'Jersey-Regular',
  },
  deleteIcon: {
    marginLeft: 'auto',
    position: 'relative',
    right: 10,
  },
});

export default ScreenHeader;
