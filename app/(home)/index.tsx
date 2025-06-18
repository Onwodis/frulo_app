import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,LogBox 
} from 'react-native';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

LogBox.ignoreLogs([
  'Warning: useInsertionEffect must not schedule updates.',
]);
export default function Home() {
  const router = useRouter();


  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: '#fff' },
      ]}
    >
      <Text  style={styles.heroText}>
        👋 Welcome to <Text style={{ color: '#6200EE' }}>Frulo</Text>
      </Text>

      <Text style={styles.tagline}>Book. Manage. Approve. All in one place.</Text>

      <View  style={styles.card}>
        <Ionicons name="calendar" size={32} color="#03a9f4" />
        <Text style={styles.cardTitle}>Instant Booking</Text>
        <Text style={styles.cardDesc}>
          Customers can book services in seconds — fast and stress-free.
        </Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
        <Text style={styles.cardTitle}>Vendor Approval</Text>
        <Text style={styles.cardDesc}>
          Vendors get real-time booking requests and can approve or reject instantly.
        </Text>
      </View>

      <View  style={styles.card}>
        <Ionicons name="chatbubbles" size={32} color="#ff9800" />
        <Text style={styles.cardTitle}>Smart Confirmations</Text>
        <Text style={styles.cardDesc}>
          No back-and-forth — just clear booking confirmations. Fast. Reliable.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('./register')}>
          <Text style={styles.exploreText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#777',
    marginBottom: 28,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exploreBtn: {
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
