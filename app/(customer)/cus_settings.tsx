import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoleStore } from '../../store/roleStore'; // Update path if different


export default function Settings() {
  
  const [notifications, setNotifications] = React.useState(true);

  

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: '#fefefe' },
      ]}
    >
      <Text style={[styles.header, { color:  '#000' }]}>
        ⚙️ Settings
      </Text>

      <View style={styles.section}>
        <Ionicons name="person-circle-outline" size={32} color="#6200ee" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.label}>Samuel Onwodi</Text>
          <Text style={styles.sub}>customer@frulo.com</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color:  '#333' }]}>
          Notifications
        </Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#ccc', true: '#6200ee' }}
        />
      </View>

      

      {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    fontSize: 13,
    color: '#888',
  },
  logoutBtn: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
  },
  logoutText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
});
