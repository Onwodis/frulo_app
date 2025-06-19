import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  collection,
  query,
  where,
  getDocs,
  startAfter,
  limit,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../lib/firebase';
import type { User } from '@/store/roleStore';
import { useRoleStore } from '@/store/roleStore';
import { Timestamp } from 'firebase/firestore';

const PAGE_SIZE = 10;

type Booking = {
  id: string;
  service: string;
  name: string;
  email: string;
  uniqueid: string;
  serviceid: string;
  date: Date;
  time: string;
  made: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  userid: string;
};

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const user: User = useRoleStore((s) => s.user);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchBookings = async (paginate = false) => {
    try {
      if (!user) return;

      let q = query(
        collection(db, 'bookings'),
        where('userid', '==', user.userid),
        limit(PAGE_SIZE)
      );

      if (paginate && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const newBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      newBookings.sort(
        (a, b) =>
          (a.date instanceof Timestamp ? a.date.toDate().getTime() : 0) -
          (b.date instanceof Timestamp ? b.date.toDate().getTime() : 0)
      );

      setBookings((prev) => (paginate ? [...prev, ...newBookings] : newBookings));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'crimson';
      case 'pending':
      default:
        return 'orange';
    }
  };

  const renderBooking = ({ item, index }: { item: Booking; index: number }) => (
    <Animated.View
      style={[
        styles.row,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={[styles.cell, { fontWeight: '600', color: '#6200EE' }]}>
        {item.service.toUpperCase()}
      </Text>
      <Text style={styles.cell}>{item.made}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <Text style={[styles.cell, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.topBar,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>📑 My Bookings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('./book')}
        >
          <Text style={styles.buttonText}>+ New Booking</Text>
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings found.</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.header]}>Service</Text>
            <Text style={[styles.cell, styles.header]}>Date</Text>
            <Text style={[styles.cell, styles.header]}>Time</Text>
            <Text style={[styles.cell, styles.header]}>Status</Text>
          </View>

          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBooking}
            contentContainerStyle={styles.tableBody}
          />

          {hasMore && (
            <TouchableOpacity
              style={styles.loadMore}
              onPress={() => fetchBookings(true)}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fffaf3',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#03a9f4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableBody: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  header: {
    fontWeight: 'bold',
    color: '#444',
  },
  loadMore: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loadMoreText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
