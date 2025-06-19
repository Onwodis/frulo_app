// app/customer/dashboard.tsx
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRoleStore } from '@/store/roleStore';
import type { User } from '@/store/roleStore';

export default function CustomerDashboard() {
  const router = useRouter();
  const user: User = useRoleStore((s) => s.user);

  const fields = [
    { label: 'Email', value: user.email },
    { label: 'User ID', value: user.userid },
    { label: 'Verified', value: user.emailVerified ? 'Yes' : 'No' },
    { label: 'Bookings', value: user.bookings || 'N/A' },
    { label: 'Last seen', value: user.lastseen?.toDate().toDateString() +" "+user.lastseen?.toDate().toTimeString().split("+")[0]},
    { label: 'Last Booking ID', value: user.lastbookingid || 'N/A' },
    { label: 'Total Payment', value: `₦${user.totalpayment || 0}` },
  ];
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>👋 Hi <Text style={{color:"green"}}>{user.name.toUpperCase()}</Text></Text>

      <ScrollView contentContainerStyle={styles.container}>
        {fields.map((field, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>{field.label}</Text>
            <Text style={styles.value}>{field.value}</Text>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.subtitle}>Ready to book a service?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./book')}
      >
        <Text style={styles.buttonText}>Book a Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 40,
    backgroundColor: '#fff9f0',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  button: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    marginBottom:40
  },
  buttonText: { color: '#fff', fontSize: 16 ,textAlign:"center"},
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
});
