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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={null}>
          <Text style={styles.modalText}>{text}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
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
    backgroundColor: 'rgba(18, 25, 2, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 26,
    color: 'yellow',
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
    backgroundColor: 'gray',
    marginRight: 10,
    borderRadius: 5,
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'red',
    marginLeft: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
});
