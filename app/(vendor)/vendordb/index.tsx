import React,{useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRoleStore } from '../../../store/roleStore';

export default function VendorDashboard() {
  const router = useRouter();
  const [user,setUser] = useState(null)
  const userr = useRoleStore((s) => s.user)

  useEffect(()=>{
    setUser(userr)
  },[userr])
  return user &&  <View style={styles.container}>
      <Text style={styles.header}>👨‍💼 Vendor Dashboard</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name ?? 'N/A'}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'N/A'}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./vend_bookings')}
      >
        <Text style={styles.buttonText}>📋 View Bookings</Text>
      </TouchableOpacity>
    </View>
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf4',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#03a9f4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
