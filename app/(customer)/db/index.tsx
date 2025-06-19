import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRoleStore } from '@/store/roleStore';
import type { User } from '@/store/roleStore';

export default function CustomerDashboard() {
  const router = useRouter();
  const user: User = useRoleStore((s) => s.user);

  const fields = [
    { label: 'Email', value: user.email },
    { label: 'User ID', value: user.userid },
    { label: 'Verified', value: user.emailVerified ? 'Yes' : 'No' },
    { label: 'Bookings', value: user.bookings || 'N/A' },
    {
      label: 'Last seen',
      value:
        user.lastseen?.toDate().toDateString() +
        ' ' +
        user.lastseen?.toDate().toTimeString().split('+')[0],
    },
    { label: 'Last Booking ID', value: user.lastbookingid || 'N/A' },
    {
      label: 'Total Payment',
      value: `₦${user.totalpayment.toLocaleString() || 0}`,
    },
  ];

  // Animations
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(fields.map(() => new Animated.Value(0))).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequential animation: welcome > cards > button
    Animated.sequence([
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.stagger(
        100,
        cardsAnim.map((a) =>
          Animated.timing(a, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
      ),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.Text
        style={[
          styles.welcome,
          {
            opacity: welcomeAnim,
            transform: [
              {
                translateY: welcomeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        👋 Hi <Text style={{ color: 'green' }}>{user.name.toUpperCase()}</Text>
      </Animated.Text>

      {fields.map((field, index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            {
              opacity: cardsAnim[index],
              transform: [
                {
                  scale: cardsAnim[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.label}>{field.label}</Text>
          <Text style={styles.value}>{field.value}</Text>
        </Animated.View>
      ))}

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Ready to book a service?
      </Animated.Text>

      <Animated.View
        style={{
          opacity: buttonAnim,
          transform: [
            {
              scale: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('./book')}
        >
          <Text style={styles.buttonText}>Book a Service</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 40,
    backgroundColor: '#fff9f0',
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
