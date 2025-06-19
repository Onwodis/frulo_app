import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

type Client = {
  id: string;
  name: string;
  email: string;
  totalpayment: number;
  logintimes: number;
  lastseen: Timestamp;
  bookings: number;
  phone?: string;
  address?: string;
  createdAt?: Timestamp;
};

const pageSize = 5;

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [visibleClients, setVisibleClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const q = query(collection(db, 'users'), where('isClient', '==', true));
        const snapshot = await getDocs(q);
        const fetchedClients: Client[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        const sorted = fetchedClients.sort((a, b) => b.totalpayment - a.totalpayment);
        setClients(sorted);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setVisibleClients(clients.slice(start, end));
  }, [page, clients]);

  const openModal = (client: Client) => {
    setSelectedClient(client);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 40 }}
        size="large"
        color="#6200ee"
      />
    );
  }

  return (
    <View style={{ flex: 1 ,padding:2 }}>
          <Text style={styles.title}>💳 My clients</Text>
      
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            {/* <Text style={[styles.cell, styles.headerCell]}>Email</Text> */}
            <Text style={[styles.cell, styles.headerCell]}>Total </Text>
            <Text style={[styles.cell, styles.headerCell]}>Bookings</Text>
            <Text style={[styles.cell, styles.headerCell]}>Login times</Text>

            {/* <Text style={[styles.cell, styles.headerCell]}>Actions</Text> */}
          </View>

          {visibleClients.map((client) => (
            <TouchableOpacity key={client.id} onPress={() => openModal(client)}>
            <View key={client.id} style={[styles.row, styles.header]} >
              <Text style={[styles.cell, { color:"green"}]}>{client.name.toUpperCase()}  👁</Text>
              <Text style={[styles.cell, { flex: 2 }]}>₦{client.totalpayment.toLocaleString()}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{client.bookings}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{client.logintimes}</Text>

             
            </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))}>
          <Text style={styles.pageBtn}>⬅ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>Page {page}</Text>
        <TouchableOpacity
          onPress={() => {
            if (page * pageSize < clients.length) setPage((p) => p + 1);
          }}
        >
          <Text
            style={[
              styles.pageBtn,
              page * pageSize >= clients.length && { color: '#999' },
            ]}
          >
            Next ➡
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeModal}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>👤 Client Details</Text>
              {selectedClient && (
                <>
                  <Text style={styles.modalItem}>Name: {selectedClient.name}</Text>
                  <Text style={styles.modalItem}>Email: {selectedClient.email}</Text>
                  <Text style={styles.modalItem}>Total Payment: ₦{selectedClient.totalpayment.toLocaleString()}</Text>
                  <Text style={styles.modalItem}>Logins: {selectedClient.logintimes}</Text>
                  <Text style={styles.modalItem}>Bookings: {selectedClient.bookings}</Text>
                  <Text style={styles.modalItem}>
                    Last Seen:{' '}
                    {selectedClient.lastseen?.toDate().toLocaleString() || 'N/A'}
                  </Text>
                  <Text style={styles.modalItem}>
                    Registered: {selectedClient.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                  </Text>
                  {selectedClient.phone && (
                    <Text style={styles.modalItem}>Phone: {selectedClient.phone}</Text>
                  )}
                  {selectedClient.address && (
                    <Text style={styles.modalItem}>Address: {selectedClient.address}</Text>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    minWidth: 800,
    padding: 12,
  },
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
  headerText: {
    fontWeight: 'bold',
    color: '#333',
  },
  headerRow: {
    backgroundColor: '#f4f4f4',
  },
  cell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'left',
    // paddingHorizontal: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#444',
  },
  viewBtn: {
    fontSize: 13,
    color: '#03A9F4',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageBtn: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#6200ee',
    textAlign: 'center',
  },
  modalItem: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#333',
  },
  modalCloseBtn: {
    backgroundColor: '#6200ee',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
