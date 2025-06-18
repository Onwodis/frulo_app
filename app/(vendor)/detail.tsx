// app/vendor/detail.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookingStore } from '../../store/bookingStore';

export default function BookingDetail() {
  const router = useRouter();
  const { index } = useLocalSearchParams();
  const bookingIndex = parseInt(index as string);
  const bookings = useBookingStore((s) => s.bookings);
  const updateStatus = useBookingStore((s) => s.updateStatus);

  const booking = bookings[bookingIndex];

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Booking not found.</Text>
      </View>
    );
  }

  const handleDecision = (status: 'approved' | 'rejected') => {
    updateStatus(bookingIndex, status);
    Alert.alert(`Booking ${status}`);
    router.push('./vendor/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Detail</Text>
      <Text style={styles.info}>Service: {booking.service}</Text>
      <Text style={styles.info}>Date: {booking.date.toDateString()}</Text>
      <Text style={styles.info}>Time: {booking.time}</Text>
      <Text style={styles.info}>Status: {booking.status}</Text>

      <View style={styles.actions}>
        <Button title="Approve" onPress={() => handleDecision('approved')} color="#4caf50" />
        <Button title="Reject" onPress={() => handleDecision('rejected')} color="#f44336" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 16, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  error: { fontSize: 16, color: 'red', textAlign: 'center' },
});
