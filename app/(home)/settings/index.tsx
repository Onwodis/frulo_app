import React from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';
import { useRoleStore } from '../../../store/roleStore';
import { useRouter } from 'expo-router';

export default function Settings() {
  const { role, setRole } = useRoleStore();
  const router = useRouter();

  const handleLogout = () => {
    setRole(null); // Clear persisted role
    router.replace('/login');
  };

  const handleHelp = () => {
    Alert.alert("Help", "For support, contact support@frulo.app or reach out via the app.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Current Role:</Text>
        <Text style={styles.value}>{role || 'Not Logged In'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={true} onValueChange={() => Alert.alert("Coming Soon", "Notification settings coming soon.")} />
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Help & Support" onPress={handleHelp} color="#03a9f4" />
        <Button title="Logout" onPress={handleLogout} color="#f44336" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  section: {
    marginBottom: 24,
  },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
  value: { fontSize: 16, color: '#666' },
  buttonGroup: { gap: 16, marginTop: 20 },
});
