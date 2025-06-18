// app/index.tsx
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const services = ['Haircut', 'Makeup', 'Massage'];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Service</Text>
      {services.map(service => (
        <Link
          href={{ pathname: '/book', params: { service } }}
          key={service}
          asChild
        >
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{service}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  button: { backgroundColor: '#6200ee', padding: 12, marginBottom: 10, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
