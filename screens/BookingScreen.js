import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingScreen({ route, navigation }) {
  const { service } = route.params;
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleBooking = async () => {
    const booking = {
      service,
      date: date.toString(),
    };
    await AsyncStorage.setItem('latestBooking', JSON.stringify(booking));
    navigation.navigate('Confirmation', { booking });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Booking: {service}</Text>

      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateText}>📅 {date.toLocaleString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        <Text style={styles.confirmText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 20, marginBottom: 20 },
  dateButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: { fontSize: 16 },
  confirmButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16 }
});
