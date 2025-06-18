import { Slot } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Navbar from '../../components/customer/Navbar'; 
import Anchor from '../../components/customer/Anchor'; 

export default function Layout() {

  return (
    // <SafeAreaView style={[styles.safeArea, { backgroundColor: !isDark ? '#121212' : '#fff' }]}>
    <View style={[styles.safeArea, { backgroundColor: '#fff' }]}>
      {/* <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} /> */}

      {/* Top Sticky Navbar */}
      <View style={styles.navbarWrap}>
        <Navbar />
      </View>

      {/* Scrollable Page Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Slot />
      </ScrollView>
      <View style={styles.navbarWrap}>
        <Anchor />
      </View>
    </View>
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
