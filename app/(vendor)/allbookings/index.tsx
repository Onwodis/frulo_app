import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  limit,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoleStore } from '@/store/roleStore';
import type { User } from '@/store/roleStore';

type Booking = {
  idd: string;
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
  vendorId: string;
  transid: string;
  bookid: string;
};

const { width } = Dimensions.get('window');
const pageSize = 5;

const VendorBookings = ({ vendorId }: { vendorId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visibleBookings, setVisibleBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const user: User = useRoleStore((s) => s.user);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    paginate(currentPage);
  }, [bookings, currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const vendorBookings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date?.toDate?.() || new Date(),
      } as Booking;
    });
    setBookings(vendorBookings);
    setLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const paginate = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setVisibleBookings(bookings.slice(start, end));
  };

  const handleAction = async (
    booking: Booking,
    action: 'approved' | 'rejected'
  ) => {
    setLoading(true);

    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, { status: action });

      if (action === 'approved') {
        if (booking.transid) {
          const q = query(
            collection(db, 'transactions'),
            where('transid', '==', booking.transid),
            limit(1)
          );

          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, { status: 'approved' });
          }
        }

        const userRef = doc(db, 'users', booking.userid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const prevUserTotal = userData.totalpayment || 0;
          await updateDoc(userRef, {
            totalpayment: prevUserTotal + booking.price,
          });
        }

        const vendorRef = doc(db, 'users', user.userid);
        const vendorSnap = await getDoc(vendorRef);
        if (vendorSnap.exists()) {
          const vendorData = vendorSnap.data();
          const prevVendorTotal = vendorData.totalpayment || 0;
          await updateDoc(vendorRef, {
            totalpayment: prevVendorTotal + booking.price,
          });
        }
      }

      Alert.alert('Success', `Booking ${action}`);
      await fetchBookings();
    } catch (error) {
      console.error('❌ handleAction error:', error);
      Alert.alert('Error', 'Something went wrong while processing this booking.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const scale = new Animated.Value(1);
    return (
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity: fadeAnim }]}>
        <Text style={styles.title}>🛠 {item.service.toUpperCase()}</Text>
        <Text>{item.made} {item.time}</Text>
        <Text>👤 {item.name.toUpperCase()}</Text>
        <Text>💵 ₦{item.price.toLocaleString()}</Text>

        {item.status === 'approved' ? (
          <Text style={{ textAlign: 'center', color: 'green', marginTop: 10 }}>Approved</Text>
        ) : item.status === 'rejected' ? (
          <Text style={{ textAlign: 'center', color: 'red', marginTop: 10 }}>Rejected</Text>
        ) : (
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.approve}
              onPress={() => handleAction(item, 'approved')}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reject}
              onPress={() => handleAction(item, 'rejected')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  };

  const nextPage = () => {
    if (currentPage * pageSize < bookings.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#6200EE" />;
  }

  return (
    <View style={{ flex: 1, paddingVertical: 30 }}>
      <Text style={styles.title}>📊 All Bookings</Text>

      <FlatList
        data={visibleBookings}
        keyExtractor={(item) => item.idd}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No pending bookings</Text>}
      />

      {bookings.length > pageSize && (
        <View style={styles.pagination}>
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 1}>
            <Text style={[styles.pageBtn, currentPage === 1 && { color: '#aaa' }]}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>Page {currentPage}</Text>
          <TouchableOpacity
            onPress={nextPage}
            disabled={currentPage * pageSize >= bookings.length}
          >
            <Text
              style={[
                styles.pageBtn,
                currentPage * pageSize >= bookings.length && { color: '#aaa' },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.88,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#3f51b5',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  approve: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  reject: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    alignItems: 'center',
    gap: 20,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageBtn: {
    fontSize: 14,
    color: '#6200EE',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#777',
  },
});

export default VendorBookings;
