// app/index.tsx
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
export default function HomeScreen() {
  const services = ['Haircut', 'Makeup', 'Massage'];

  return (
     <ScrollView >
    <View style={styles.container}>
      <Text style={styles.header}>💅 Welcome to Frulo Booking</Text>
      <Text style={styles.description}>Frulo Booking App is a sleek, lightweight mobile solution that makes booking salon and grooming services fast, easy, and stress-free. With just a few taps, users can select a service (like Haircut, Makeup, or Massage), choose a date and time, and confirm their booking.

Designed with a beautiful and responsive UI, Frulo is optimized for dark mode and works seamlessly across devices. Whether you’re a busy professional or just need self-care time, Frulo brings appointments to your fingertips.</Text>
      <Text style={styles.sub}>Choose a service to begin:</Text>
      {services.map(service => (
        <Link
          href={{ pathname: '/book', params: { service } }}
          key={service}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>{service}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, fontWeight: 'normal', marginBottom: 10 },
  sub: { fontSize: 16, color: '#555', marginBottom: 20 },
  card: {
    backgroundColor: '#ff758c',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
