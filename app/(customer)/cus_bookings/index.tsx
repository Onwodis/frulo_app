import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useNavigation } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAfter,
  limit,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../lib/firebase'; // Adjust path as needed
import type { User } from '@/store/roleStore';
import { useRoleStore } from '@/store/roleStore';

const PAGE_SIZE = 10;
type Booking = {
  id: string; // ← Fix here
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
const BookingsScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const user: User = useRoleStore((s) => s.user);

  const fetchBookings = async (paginate = false) => {
    try {
      const auth = getAuth();

      if (!user) return;

      const bookingsRef = collection(db, 'bookings');
      let q = query(
        bookingsRef,
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

      if (paginate) {
        setBookings((prev) => [
          ...prev,
          ...newBookings.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        ]);
      } else {
        setBookings(newBookings);
      }

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
  }, []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: '#333',
    },
    button: {
      backgroundColor: '#007BFF',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '500',
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
      paddingBottom: 20,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: '#eee',
      paddingVertical: 6,
    },
    cell: {
      flex: 1,
      fontSize: 14,
      color: '#444',
    },
    header: {
      fontWeight: '600',
      color: '#000',
    },
    loadMore: {
      padding: 10,
      backgroundColor: '#eee',
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 10,
    },
    loadMoreText: {
      color: '#333',
      fontWeight: '500',
    },
  });

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.row}>
      <Text style={[styles.cell,{paddingHorizontal:3}]}>{item.made}</Text>
      <Text style={styles.cell}>{item.service}</Text>
      <Text style={styles.cell}>{'₦' + item.price.toLocaleString()}</Text>
      <Text style={[styles.cell, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
      <Text style={[styles.cell, { color: getStatusColor(item.status) }]}>
        {item.id}
      </Text>
    </View>
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
      default:
        return 'orange';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Your Bookings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('./book')}
        >
          <Text style={styles.buttonText}>+ New Booking</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>You do not have any bookings yet.</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.header]}>Date & Time</Text>
            <Text style={[styles.cell, styles.header]}>Service</Text>
            <Text style={[styles.cell, styles.header]}>Price</Text>
            <Text style={[styles.cell, styles.header]}>Status</Text>
            <Text style={[styles.cell, styles.header]}>Booking id</Text>
          </View>

          {/* <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBooking}
            contentContainerStyle={styles.tableBody}
          /> */}
        
            <FlatList
              data={bookings}
              horizontal={false} // Still vertical
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
};

export default BookingsScreen;
