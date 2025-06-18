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
type Payment = {
  id: string; // ← Fix here
  service: string;
  name: string;
  email: string;
  datepaid: string;
  timepaid: string;
  uniqueid: string;
  serviceid: string;
  date: Date;
  time: string;
  made: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  userid: string;
};
const PaymentsScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const user: User = useRoleStore((s) => s.user);

  const fetchPayments = async (paginate = false) => {
    try {
      const auth = getAuth();

      if (!user) return;

      const paysRef = collection(db, 'transactions');
      let q = query(
        paysRef,
        where('userid', '==', user.userid),
        limit(PAGE_SIZE)
      );

      if (paginate && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const newPayments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      if (paginate) {
        setPayments((prev) => [
          ...prev,
          ...newPayments.sort(
            (b,a) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        ]);
      } else {
        setPayments(newPayments);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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

  const renderPayment = ({ item }: { item: Payment }) => (
    <View style={styles.row}>
      <Text style={[styles.cell,{paddingHorizontal:3}]}>{item.service}</Text>

      <Text style={[styles.cell,{paddingHorizontal:3}]}>{item.datepaid}</Text>
      <Text style={[styles.cell,{paddingHorizontal:3}]}>{item.timepaid}</Text>
      <Text style={[styles.cell,{paddingHorizontal:3}]}>{'₦' + item.price.toLocaleString()}</Text>
      <Text style={[styles.cell, {paddingHorizontal:3, color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
      {/* <Text style={[styles.cell, { color: getStatusColor(item.status) }]}>
        {item.id}
      </Text> */}
    </View>
  );

  const getStatusColor = (status: Payment['status']) => {
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
      <View style={[styles.topBar,{marginBottom:50}]}>
        <Text style={[styles.title]}>My Payments</Text>
      
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : payments.length === 0 ? (
        <Text style={styles.emptyText}>You do not have any payments yet.</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.header]}>Service</Text>

            <Text style={[styles.cell, styles.header]}>Date</Text>
            <Text style={[styles.cell, styles.header]}>Time</Text>
            <Text style={[styles.cell, styles.header]}>Price</Text>
            <Text style={[styles.cell, styles.header]}>Status</Text>
            {/* <Text style={[styles.cell, styles.header]}>Payment id</Text> */}
          </View>

          {/* <FlatList
            data={Payments}
            keyExtractor={(item) => item.id}
            renderItem={renderPayment}
            contentContainerStyle={styles.tableBody}
          /> */}
        
            <FlatList
              data={payments}
              horizontal={false} // Still vertical
              keyExtractor={(item) => item.id}
              renderItem={renderPayment}
              contentContainerStyle={styles.tableBody}
            />
    

          {hasMore && (
            <TouchableOpacity
              style={styles.loadMore}
              onPress={() => fetchPayments(true)}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default PaymentsScreen;
