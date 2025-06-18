import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoleStore } from '../../store/roleStore';

export default function Success() {
  const router = useRouter();
  const role = useRoleStore((state) => state.role);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Booking Successful!</Text>
      <Text style={styles.subtitle}>We have received your booking request.{role}</Text>

      <View style={styles.buttonGroup}>
        <Button
          title="Back to Dashboard"

          onPress={() => router.push(role ===`customer`?`../(customer)/db`:`../(vendor)/vendordb`)}
          color="#4CAF50"
        />
        <Button
          title="Make Another Booking"
          onPress={() => router.push('../(customer)cust_booking')}
          color="#6200EE"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  buttonGroup: { width: '100%', gap: 12 },
});
