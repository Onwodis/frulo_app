import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmationScreen({ route }) {
  const { booking } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.success}>🎉 Booking Confirmed!</Text>
      <Text style={styles.details}>
        Service: {booking.service}
        {"\n"}Time: {new Date(booking.date).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  success: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  details: { marginTop: 20, fontSize: 18, textAlign: 'center' }
});
