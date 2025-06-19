import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const MESSAGES = [
  '📅 Book services  with Frulo Booking App',
  '⚡ Vendors approve or reject in real-time !',
  '🧘 Frulo makes your service seamless ',
  '🔐 Secure, lightweight, and built for speed',
  '💬 Chatless confirmations — fast and smart!',
];

export default function FruloNavbar() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const screenWidth = Dimensions.get('window').width;

  const scrollX = useRef(new Animated.Value(screenWidth)).current;
  const [messageIndex, setMessageIndex] = useState(0);

  const startMarquee = () => {
    scrollX.setValue(screenWidth);
    Animated.timing(scrollX, {
      toValue: -screenWidth * 1.5, // scrolls off-screen
      duration: 12000, // slower animation
      useNativeDriver: true,
    }).start(() => {
      // Move to next message
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    });
  };

  useEffect(() => {
    startMarquee(); // trigger initial scroll
  }, [messageIndex]);

  return (
    <View style={[styles.navbar, { backgroundColor: isDark ? '#1f1f1f' : '#ff758c' }]}>
      <TouchableOpacity onPress={() => router.push('/db')}>
        <Text style={styles.brand}>✂️ Frulo</Text>
      </TouchableOpacity>

      <View style={styles.marqueeContainer}>
        <Animated.Text
          style={[
            styles.marqueeText,
            { transform: [{ translateX: scrollX }] },
          ]}
        >
          {MESSAGES[messageIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  marqueeContainer: {
    overflow: 'hidden',
    flex: 1,
    height: 26,
    justifyContent: 'center',
  },
  marqueeText: {
    fontSize: 14,
    color: '#fff',
    // whiteSpace: 'nowrap',
  },
});
