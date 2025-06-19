import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchStats = async () => {
    try {
      setLoading(true);

      const bookingsSnapshot = await getDocs(query(collection(db, 'bookings')));
      const transactionsSnapshot = await getDocs(query(collection(db, 'transactions')));
      const servicesSnapshot = await getDocs(query(collection(db, 'services')));

      const bookings = bookingsSnapshot.docs.map(doc => doc.data());
      const transactions = transactionsSnapshot.docs.map(doc => doc.data());
      const services = servicesSnapshot.docs.map(doc => doc.data());

      const pending = bookings.filter(b => b.status === 'pending').length;
      const approved = bookings.filter(b => b.status === 'approved').length;
      const totalApprovedAmount = bookings
        .filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + (b.price || 0), 0);

      const initiated = transactions.filter(t => t.status === 'initiated').length;
      const totalInitiatedAmount = transactions
        .filter(t => t.status === 'initiated')
        .reduce((sum, t) => sum + (t.price || 0), 0);

      setStats({
        pending,
        approved,
        initiated,
        services: services.length,
        totalApprovedAmount,
        totalInitiatedAmount,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        📊 Vendor Dashboard
      </Animated.Text>

      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
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
      </Animated.View>
    </ScrollView>
  );
}

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffdf8',
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: '85%',
    margin: 8,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
