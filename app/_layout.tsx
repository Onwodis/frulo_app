import React from 'react';
import { Slot } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';
import Navbar from '../components/Navbar'; // or FruloNavbar

export default function Layout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Sticky Navbar */}
      <View style={styles.navbarWrap}>
        <Navbar />
      </View>

      {/* Scrollable Page Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Slot />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navbarWrap: {
    position: 'sticky', // works on web
    top: 0,
    zIndex: 100,
    backgroundColor: '#ff758c', // or darken based on theme
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
});
