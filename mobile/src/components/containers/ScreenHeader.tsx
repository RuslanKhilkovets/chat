import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GoBack, SmallModal} from '@/components';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useChatContext} from '@/context/Chat/ChatContext';

interface IScreenHeaderProps {
  chatMode?: boolean;
  payload?: any;
  title?: string;
}

const ScreenHeader = ({title, payload, chatMode}: IScreenHeaderProps) => {
  const {navigate} = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const {deleteChat} = useChatContext();

  const handleDelete = () => {
    deleteChat(payload?.chatId);
    setModalVisible(false);
  };

  return (
    <>
      <View style={[styles.header, !chatMode && {justifyContent: 'center'}]}>
        <View style={styles.icon}>
          <GoBack />
        </View>

        {title && <Text style={styles.headerTitle}>{title}</Text>}

        {payload && (
          <Pressable
            style={styles.userInfo}
            onPress={() => navigate('Profile', {userId: payload.userId})}>
            <View style={styles.profilePic} />
            <View>
              <Text style={styles.name}>{payload.name}</Text>
              <Text style={styles.isOnline}>
                {payload.isTyping
                  ? 'Typing...'
                  : payload.isOnline
                  ? 'Online'
                  : 'Offline'}
              </Text>
            </View>
          </Pressable>
        )}

        {chatMode && (
          <TouchableOpacity
            style={styles.deleteIcon}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}>
            <Icon name="delete" color="yellow" size={32} />
          </TouchableOpacity>
        )}
      </View>

      <SmallModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        text="Are you sure you want to delete this chat?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    backgroundColor: 'yellow',
  },
  userInfo: {
    marginLeft: 70,
    flexDirection: 'row',
    gap: 15,
  },
  headerTitle: {
    zIndex: 1,
    color: 'yellow',
    fontSize: 26,
    fontFamily: 'Jersey20-Regular',
    textTransform: 'capitalize',
  },
  name: {
    color: 'yellow',
    fontSize: 22,
    fontFamily: 'Jersey20-Regular',
  },
  isOnline: {
    color: 'yellow',
    fontSize: 16,
    fontFamily: 'Jersey20-Regular',
  },
  deleteIcon: {
    marginLeft: 'auto',
    position: 'relative',
    right: 10,
  },
});

export default ScreenHeader;
