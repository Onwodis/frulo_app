import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌟 About Frulo</Text>

      <Text style={styles.description}>
        Frulo is a smart, lightweight booking platform designed for both customers and vendors.
        Whether you are offering services or booking them — Frulo makes it seamless.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 What You Can Do</Text>
        <Text style={styles.item}>• Customers can book services in seconds</Text>
        <Text style={styles.item}>• Vendors can approve or reject bookings easily</Text>
        <Text style={styles.item}>• Real-time updates and role-based navigation</Text>
        <Text style={styles.item}>• Clean, offline-friendly interface</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Security & Simplicity</Text>
        <Text style={styles.item}>• Your data stays on your device</Text>
        <Text style={styles.item}>• Authentication powered by Firebase or secure mock logic</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="Back to Home" color="#6200ee" onPress={() => router.push('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  item: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
    color: '#666',
  },
});
