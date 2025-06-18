import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoleStore } from '../../../store/roleStore'; // Adjust path if needed
import { Ionicons } from '@expo/vector-icons';

export default function ClientsList() {
  const clients = useRoleStore((state) =>
    state.getUsers().filter((user) => user.role === 'customer')
  );

  const handleMessage = (clientName: string) => {
    Alert.alert('📩 Message Client', `Pretend message sent to ${clientName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Your Clients</Text>

      {clients.length > 0 ? (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.userid}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons name="person-circle-outline" size={40} color="#6200ee" />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              <TouchableOpacity
                style={styles.messageBtn}
                onPress={() => handleMessage(item.name)}
              >
                <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No customers found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  messageBtn: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
