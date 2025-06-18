import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoleStore } from '@/store/roleStore';
import type { User } from '@/store/roleStore';

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
  vendorId: string;
  transid: string;
  bookingid: string;
};

const { width } = Dimensions.get('window');
const pageSize = 5;

const VendorBookings = ({ vendorId }: { vendorId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visibleBookings, setVisibleBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const user: User = useRoleStore((s) => s.user);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    paginate(currentPage);
  }, [bookings, currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const vendorBookings = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Booking))
      .filter(
        (booking) =>
          booking.vendorId === vendorId && booking.status === 'pending'
      );
    setBookings(vendorBookings);
    setLoading(false);
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
      // ✅ 1. Update booking status
      const bookingRef = doc(db, 'bookings', booking.bookingid);
      await updateDoc(bookingRef, { status: action });

      if (action === 'approved') {
        // ✅ 2. Update transaction if exists
        if (booking.transid) {
          const transactionRef = doc(db, 'transactions', booking.transid);
          await updateDoc(transactionRef, { status: 'approved' });
        }

        // ✅ 3. Update user totalpayment
        const userRef = doc(db, 'users', booking.userid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const prevUserTotal = userData.totalpayment || 0;
          await updateDoc(userRef, {
            totalpayment: prevUserTotal + booking.price,
          });
        } else {
          console.warn(`User not found: ${booking.userid}`);
        }

        // ✅ 4. Update vendor totalpayment
        const vendorRef = doc(db, 'users', user.userid); // `user` from useRoleStore
        const vendorSnap = await getDoc(vendorRef);
        if (vendorSnap.exists()) {
          const vendorData = vendorSnap.data();
          const prevVendorTotal = vendorData.totalpayment || 0;
          await updateDoc(vendorRef, {
            totalpayment: prevVendorTotal + booking.price,
          });
        } else {
          console.warn(`Vendor not found: ${user.userid}`);
        }
      }

      Alert.alert('Success', `Booking ${action}`);
      await fetchBookings();
    } catch (error) {
      console.error('❌ handleAction error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while processing this booking.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <Text style={styles.title}>🛠 {item.service}</Text>
      <Text>👤 {item.name}</Text>
      <Text>💵 ₦{item.price.toLocaleString()}</Text>
      <View style={styles.buttons}>
        {item.status ==="approved"?<TouchableOpacity
          style={styles.approve}
        >
          <Text style={styles.buttonText}>Approved</Text>
        </TouchableOpacity>:
        <TouchableOpacity
          style={styles.approve}
          onPress={() => handleAction(item, 'approved')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>}
        <TouchableOpacity
          style={styles.reject}
          onPress={() => handleAction(item, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    return (
      <ActivityIndicator
        style={{ marginTop: 50 }}
        size="large"
        color="#6200EE"
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <FlatList
        data={visibleBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending bookings</Text>
        }
      />

      {bookings.length > pageSize && (
        <View style={styles.pagination}>
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 1}>
            <Text
              style={[styles.pageBtn, currentPage === 1 && { color: '#aaa' }]}
            >
              Prev
            </Text>
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
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
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
