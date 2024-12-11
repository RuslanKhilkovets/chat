import {useTheme} from '@/context/Theme/ThemeContext';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ISmallModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  confirmText?: string;
  cancelText?: string;
}

const SmallModal: React.FC<ISmallModalProps> = ({
  visible,
  onClose,
  onConfirm,
  text,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  const {theme, colorScheme} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[
          styles.modalOverlay,
          {backgroundColor: theme[colorScheme].shadow},
        ]}
        onPress={onClose}>
        <Pressable
          style={[
            styles.modalContent,
            {backgroundColor: theme[colorScheme].bgSecondary},
          ]}
          onPress={null}>
          <Text
            style={[styles.modalText, {color: theme[colorScheme].textPrimary}]}>
            {text}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {backgroundColor: theme[colorScheme].bgPrimary},
              ]}
              onPress={onClose}>
              <Text
                style={[
                  styles.cancelText,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {backgroundColor: theme[colorScheme].pink},
              ]}
              onPress={onConfirm}>
              <Text
                style={[
                  styles.confirmText,
                  {color: theme[colorScheme].textPrimary},
                ]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SmallModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Jersey20-Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
  },
  confirmText: {
    fontSize: 16,
  },
});
