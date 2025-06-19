import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();

  // Animations
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const section1Anim = useRef(new Animated.Value(0)).current;
  const section2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(section1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(section2Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [
              {
                scale: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        🌟 About Frulo
      </Animated.Text>

      <Animated.Text
        style={[
          styles.description,
          {
            opacity: descAnim,
            transform: [
              {
                translateY: descAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Frulo is a smart, lightweight booking platform designed for both customers and vendors.
        Whether you are offering services or booking them — Frulo makes it seamless.
      </Animated.Text>

      <Animated.View
        style={{
          opacity: section1Anim,
          transform: [
            {
              translateY: section1Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 What You Can Do</Text>
          <Text style={styles.item}>• Customers can book services in seconds</Text>
          <Text style={styles.item}>• Vendors can approve or reject bookings easily</Text>
          <Text style={styles.item}>• Real-time updates and role-based navigation</Text>
          <Text style={styles.item}>• Clean, offline-friendly interface</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: section2Anim,
          transform: [
            {
              translateY: section2Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Security & Simplicity</Text>
          <Text style={styles.item}>• Your data stays on your device</Text>
          <Text style={styles.item}>• Authentication powered by Firebase or secure mock logic</Text>
        </View>
      </Animated.View>

      <View style={{ marginTop: 24 }}>
        <Button title="Back to Home" color="#6200ee" onPress={() => router.push('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  item: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
    color: '#666',
  },
});
