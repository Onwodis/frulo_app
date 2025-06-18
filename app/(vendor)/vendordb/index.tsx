import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoleStore } from '@/store/roleStore';

export default function VendorDashboard() {
  const user = useRoleStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    initiated: 0,
    services: 0,
    totalApprovedAmount: 0,
    totalInitiatedAmount: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);

      const bookingsRef = collection(db, 'bookings');
      const transactionsRef = collection(db, 'transactions');
      const servicesRef = collection(db, 'services');

      // Fetch bookings
      const bookingsSnapshot = await getDocs(query(bookingsRef));
      const bookings = bookingsSnapshot.docs.map(doc => doc.data());

      const pending = bookings.filter(b => b.status === 'pending').length;
      const approved = bookings.filter(b => b.status === 'approved').length;
      const totalApprovedAmount = bookings
        .filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + (b.price || 0), 0);

      // Fetch transactions
      const txSnapshot = await getDocs(query(transactionsRef));
      const transactions = txSnapshot.docs.map(doc => doc.data());

      const initiated = transactions.filter(t => t.status === 'initiated').length;
      const totalInitiatedAmount = transactions
        .filter(t => t.status === 'initiated')
        .reduce((sum, t) => sum + (t.price || 0), 0);

      // Fetch services
      const servicesSnapshot = await getDocs(query(servicesRef));
      const services = servicesSnapshot.docs.map(doc => doc.data());

      setStats({
        pending,
        approved,
        initiated,
        services: services.length,
        totalApprovedAmount,
        totalInitiatedAmount,
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="purple" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Vendor Dashboard</Text>
      <View style={styles.statsContainer}>
        <StatBox label="Pending Bookings" value={stats.pending} color="#ff9800" />
        <StatBox label="Approved Bookings" value={stats.approved} color="#4caf50" />
        <StatBox label="Services Offered" value={stats.services} color="#3f51b5" />
        <StatBox label="Initiated Txns" value={stats.initiated} color="#00bcd4" />
        <StatBox
          label="Approved Revenue"
          value={`₦${stats.totalApprovedAmount.toLocaleString()}`}
          color="#8bc34a"
        />
        <StatBox
          label="Initiated Revenue"
          value={`₦${stats.totalInitiatedAmount.toLocaleString()}`}
          color="#9c27b0"
        />
      </View>
    </ScrollView>
  );
}

const StatBox = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  card: {
    width: '75%',
    margin: 8,
    padding: 26,
    borderRadius: 12,
    elevation: 3,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  cardValue: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
