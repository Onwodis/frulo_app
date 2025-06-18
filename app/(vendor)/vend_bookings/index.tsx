import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingStore } from '../../../store/bookingStore';
import { Ionicons } from '@expo/vector-icons';
import { useRoleStore } from '../../../store/roleStore';


export default function VendorDashboard() {
  const router = useRouter();
  const bookings = useBookingStore((state) => state.bookings);
  // const users = useRoleStore((s) => s.getUsers());
  const user = useRoleStore((state) => state.user);

  const [showPending, setShowPending] = useState(true);

  const filteredBookings = showPending
    ? bookings.filter((b) => b.status === 'pending')
    : bookings.filter((b) => b.status !== 'pending');
  const getStatusStyle = (status: 'pending' | 'approved' | 'rejected') => ({
  color:
    status === 'approved'
      ? '#4caf50'
      : status === 'rejected'
      ? '#f44336'
      : '#ff9800',
  fontWeight: '600',
  fontSize: 13,
});
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        👨‍🔧 {user?.name}s Dashboard ({user?.role})
      </Text>

      <Pressable
        style={styles.toggleRow}
        onPress={() => setShowPending(!showPending)}
      >
        <Ionicons
          name={showPending ? 'toggle-outline' : 'toggle'}
          size={32}
          color={showPending ? '#999' : '#4caf50'}
        />
        <Text style={styles.toggleText}>
          {showPending ? 'Pending Bookings' : 'Sorted Bookings'}
        </Text>
      </Pressable>

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/detail?index=${index}`)}
            >
              <Text style={styles.cardTitle}>{item.service}</Text>
              <Text style={styles.cardInfo}>
                {item.date.toDateString()} at {item.time}
              </Text>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      item.status === 'approved'
                        ? '#4caf50'
                        : status === 'rejected'
                        ? '#f44336'
                        : '#ff9800',
                  },
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>
          No {showPending ? 'Pending' : 'Sorted'} bookings yet.
        </Text>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardInfo: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  status: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
    color: '#999',
  },
});
