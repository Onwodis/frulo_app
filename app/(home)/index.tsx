import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LogBox,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

LogBox.ignoreLogs([
  'Warning: useInsertionEffect must not schedule updates.',
]);

export default function Home() {
  const router = useRouter();

  // Animation refs
  const heroScale = useRef(new Animated.Value(0)).current;
  const card1 = useRef(new Animated.Value(0)).current;
  const card2 = useRef(new Animated.Value(0)).current;
  const card3 = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(heroScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.timing(card1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(card2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(card3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text
        style={[
          styles.heroText,
          { transform: [{ scale: heroScale }] },
        ]}
      >
        👋 Welcome to <Text style={{ color: '#6200EE' }}>Frulo</Text>
      </Animated.Text>

      <Text style={styles.tagline}>Book. Manage. Approve. All in one place.</Text>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: card1,
            transform: [
              {
                translateY: card1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="calendar" size={32} color="#03a9f4" />
        <Text style={styles.cardTitle}>Instant Booking</Text>
        <Text style={styles.cardDesc}>
          Customers can book services in seconds — fast and stress-free.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: card2,
            transform: [
              {
                translateY: card2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
        <Text style={styles.cardTitle}>Vendor Approval</Text>
        <Text style={styles.cardDesc}>
          Vendors get real-time booking requests and can approve or reject instantly.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: card3,
            transform: [
              {
                translateY: card3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="chatbubbles" size={32} color="#ff9800" />
        <Text style={styles.cardTitle}>Smart Confirmations</Text>
        <Text style={styles.cardDesc}>
          No back-and-forth — just clear booking confirmations. Fast. Reliable.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.actions,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => router.push('./register')}
        >
          <Text style={styles.exploreText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heroText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#777',
    marginBottom: 28,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exploreBtn: {
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
