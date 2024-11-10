import React, {useEffect} from 'react';
import {StyleSheet, View, Modal, Pressable, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {AppIcon, Button} from '@/components';
import {DateFormatter, nullToDash} from '@/helpers';

interface IDatePickerProps {
  isOpen: boolean;
  date?: Date | null;
  onChange: (date: Date | undefined) => void;
  onClose: () => void;
  setOpen: () => void;
  maxDate?: Date;
  minDate?: Date;
}

const DatePicker = ({
  setOpen,
  isOpen,
  date,
  onChange,
  onClose,
  maxDate,
  minDate,
}: IDatePickerProps) => {
  const currentDate = date || new Date();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type !== 'dismissed' && selectedDate) {
      onChange(selectedDate);
      onClose();
    }
    onClose();
  };

  useEffect(() => {
    onClose();
  }, [date]);

  return (
    <View style={{flexDirection: 'row'}}>
      <Button
        onPress={setOpen}
        type="light"
        style={styles.selectDateButton}
        after={<AppIcon name="arrow_down" size={6} />}>
        {nullToDash(DateFormatter.formatLocalizedDate(date))}
      </Button>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}>
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View style={styles.dialogContainer}>
            <DateTimePicker
              maximumDate={maxDate}
              minimumDate={minDate}
              value={currentDate instanceof Date ? currentDate : new Date()}
              mode="date"
              display="inline"
              onChange={handleDateChange}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 35,
  },
  dialogContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  selectDateButton: {
    flexShrink: 1,
    borderRadius: 10,
  },
});
