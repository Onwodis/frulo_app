// app/confirm.tsx
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';


import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Confirm() {
  const [booking, setBooking] = useState<{
    service: string;
    date: string;
    time: string;
  } | null>(null);
  //   if(booking){alert(booking.service)}

  useEffect(() => {
    const loadBooking = async () => {
      const stored = await AsyncStorage.getItem('booking');
      if (stored) setBooking(JSON.parse(stored));
    //   else {
    //     Alert.alert(
    //     "Booking Error",
    //     "Oops! Please select a service first.",
    //     [{ text: "OK", onPress: () => router.push("/") }]
    //   );
    //   }
    };
    loadBooking();
  }, [booking]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎉 Booking Confirmed!</Text>
      {booking && (
        <Text style={styles.message}>
          You booked a <Text style={styles.highlight}>{booking.service}</Text>{' '}
          on <Text style={styles.highlight}>{booking.date}</Text> at{' '}
          <Text style={styles.highlight}>{booking.time}</Text>.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 16,
  },
  message: { fontSize: 16 },
  highlight: { fontWeight: 'bold', color: '#6a11cb' },
});
