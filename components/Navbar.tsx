import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

export default function FruloNavbar() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const scrollTo = (sectionId: string) => {
    const el = document?.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <View style={[styles.navbar, { backgroundColor: isDark ? '#1f1f1f' : '#ff758c' }]}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.brand}>✂️ Frulo</Text>
      </TouchableOpacity>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/book')}>
          <Text style={styles.link}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/confirm')}>
          <Text style={styles.link}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'sticky', // makes it stick to the top
    top: 0,
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ff758c', // fallback color
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  links: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 20,
  },
});

