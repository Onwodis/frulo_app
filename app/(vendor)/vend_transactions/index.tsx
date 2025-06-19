import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Transaction = {
  id: string;
  bookid: string;
  transid: string;
  email: string;
  service: string;
  price: number;
  status: 'approved' | 'pending' | 'failed';
  datepaid: string;
  timepaid: string;
  createdAt: any;
  userid: string;
};

const pageSize = 6;

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visible, setVisible] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setVisible(transactions.slice(start, end));
  }, [page, transactions]);

  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{item.transid}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.service}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>₦{item.price.toLocaleString()}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.status}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.datepaid}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.timepaid}</Text>
    </View>
  );

  const nextPage = () => {
    if (page * pageSize < transactions.length) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ padding: 16 ,flex:1}}>
      <Text style={styles.title}>💳 Transactions</Text>

      <ScrollView horizontal>
        <View>
          {/* Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>TransID</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>Service</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>Amount</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>Date</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>Time</Text>
          </View>

          {/* Data Rows */}
          <FlatList
            data={visible}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      </ScrollView>

      {/* Pagination */}
      {transactions.length > pageSize && (
        <View style={styles.pagination}>
          <TouchableOpacity onPress={prevPage} disabled={page === 1}>
            <Text style={[styles.pageBtn, page === 1 && { color: '#aaa' }]}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>Page {page}</Text>
          <TouchableOpacity onPress={nextPage} disabled={page * pageSize >= transactions.length}>
            <Text
              style={[
                styles.pageBtn,
                page * pageSize >= transactions.length && { color: '#aaa' },
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  header: {
    backgroundColor: '#f5f5f5',
  },
  cell: {
    paddingHorizontal: 6,
    fontSize: 13,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#444',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  pageBtn: {
    fontSize: 14,
    color: '#6200EE',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TransactionList;
